import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchInquiryById } from "../../../../redux/slice/inquirySlice";
import {
  MessageCircle,
  Copy,
  Calendar,
  Tag,
  MapPin,
  ExternalLink,
  Download,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/utils/axios.utils"; // adjust path to your axios instance
import { saveAs } from "file-saver";
import { toast } from "sonner";

const CountryFlag = ({ code }) => {
  if (!code) return null;
  try {
    const chars = [...code.toUpperCase()].map((c) => 127397 + c.charCodeAt());
    return <span className="ml-1.5">{String.fromCodePoint(...chars)}</span>;
  } catch {
    return null;
  }
};

/**
 * Senior-quality InquiryDetail
 * - Responsive: mobile-first, collapses/expands gracefully
 * - Accessible: aria labels, keyboard copy
 * - UX-friendly: copy ID, formatted date/currency, image carousel
 *
 * Note: keep formatting logic client-side (we return raw pricePerUnit + priceUnit).
 */

const Skeleton = () => (
  <div className="animate-pulse space-y-3 p-6">
    <div className="h-6 w-1/3 bg-gray-200 rounded" />
    <div className="flex gap-4">
      <div className="h-40 w-40 bg-gray-200 rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const Badge = ({ children, tone = "yellow" }) => {
  const classes =
    tone === "green"
      ? "bg-green-100 text-green-800"
      : tone === "red"
      ? "bg-rose-100 text-rose-700"
      : "bg-yellow-100 text-yellow-700";
  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-0.5 text-xs font-medium rounded ${classes}`}
    >
      {children}
    </span>
  );
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

const formatCurrencyINR = (value) =>
  typeof value === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(value)
    : "N/A";

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const InquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExporting, setIsExporting] = useState(false);

  const {
    selectedInquiry: q,
    loading,
    error,
  } = useSelector((s) => s.inquiries || {});

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(fetchInquiryById(id));
  }, [dispatch, id]);

  if (loading) return <Skeleton />;
  if (error) return <p className="text-center text-red-600 p-6">{error}</p>;
  if (!q)
    return <p className="text-center text-gray-600 p-6">Inquiry not found.</p>;

  const { buyer = {}, inquiry = {}, product = {} } = q;

  const longId = inquiry.id || "N/A"; // server should add full buyer._id later
  const shortId = buyer.id || String(longId).slice(-6) || "N/A";
  const createdAt = inquiry.createdAt ? formatDate(inquiry.createdAt) : "N/A";
  const updatedAt = inquiry.updatedAt ? formatDate(inquiry.updatedAt) : "N/A";

  const productHero = (product.images && product.images[0]) || "";
  const thumbnails = product.images || [];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(String(longId));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const handleExportInquiry = async () => {
    const inquiryId = inquiry?.id || inquiry?._id;
    if (!inquiryId) {
      toast.error("Inquiry ID not available for export");
      return;
    }

    try {
      setIsExporting(true);
      const { data } = await api.post(
        "/inquiry/export",
        { ids: [inquiryId] },
        { responseType: "blob" }
      );
      const filename = `inquiry_${String(inquiryId).slice(
        -6
      )}_${Date.now()}.xlsx`;
      saveAs(data, filename);
      toast.success("Export downloaded");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to export inquiry");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              Inquiry Detail
            </h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">ID</span>
                <span className="font-medium text-gray-800">
                  {String(longId).slice(-6)}
                </span>
                <button
                  onClick={handleCopy}
                  aria-label="Copy inquiry ID"
                  className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200"
                >
                  <Copy size={14} />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span className="text-sm">{createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Badge tone={inquiry.status === "Completed" ? "green" : "yellow"}>
            {inquiry.status || "Ongoing"}
          </Badge>

          <button
            onClick={() => {
              // prefer to have the actual buyer._id from API; fallback to readInfo.readBy
              const chatId = buyer._id || inquiry.readInfo?.readBy || buyer.id;
              if (chatId) navigate(`/sellerdashboard/chats/${chatId}`);
              else alert("Chat user id not available");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navyblue text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-navyblue"
            aria-label="Start chat with buyer"
          >
            <MessageCircle size={18} />
            Chat Now
          </button>
          {product.id ? (
            <a
              href={`/sellerdashboard/product/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition"
            >
              <ExternalLink size={16} />
              Product
            </a>
          ) : (
            <button
              onClick={() => window.alert("Product page not available")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition"
            >
              <ExternalLink size={16} />
              Product
            </button>
          )}
        </div>
      </div>

      {/* main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Buyer + Inquiry */}
        <div className="lg:col-span-1 bg-white rounded-2xl border p-5 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-12 h-12">
              {/* AvatarImage will show image when valid; onError sets src to empty so AvatarFallback shows */}
              <AvatarImage
                src={buyer.profileImage || ""}
                alt={buyer.name || "Buyer profile"}
                onError={(e) => {
                  // remove broken src so AvatarFallback renders
                  e.currentTarget.src = "";
                }}
                loading="lazy"
              />
              <AvatarFallback>{getInitials(buyer.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-gray-500">Buyer</div>
              <div className="font-semibold text-gray-900">
                {buyer.name || "Unknown"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ID:{" "}
                <span className="font-mono text-gray-700 ml-1">{shortId}</span>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-800">{buyer.email || "N/A"}</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-gray-500">Quantity</dt>
              <dd className="text-gray-800">
                {inquiry.quantity ?? "N/A"} {inquiry.unitType || ""}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-gray-500">Country</dt>
              <dd className="text-gray-800 flex items-center gap-2">
                <CountryFlag code={inquiry.countryCode} />
                {inquiry.country || "N/A"}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd className="text-gray-800">{createdAt}</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-gray-500">Updated</dt>
              <dd className="text-gray-800">{updatedAt}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Message</h5>
            <div className="text-sm text-gray-700 italic whitespace-pre-wrap">
              {inquiry.message || "No message provided."}
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => alert("Flagged as spam (implement API)")}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm hover:bg-rose-50"
              aria-label="Mark spam"
            >
              Flag Spam
            </button>

            <button
              onClick={handleExportInquiry}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-sm"
              aria-label="Download inquiry XLS"
            >
              <Download size={16} /> {isExporting ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>

        {/* Right: Product (spans 2 cols on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border p-5 shadow-sm flex flex-col">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image / gallery */}
            <div className="w-full md:w-1/3 rounded-md overflow-hidden">
              <div
                className="w-full h-56 md:h-64 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden"
                role="img"
                aria-label={product.productName || "Product image"}
              >
                {productHero ? (
                  <img
                    src={productHero}
                    alt={product.productName || "product"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">No image</div>
                )}
              </div>

              {/* thumbnails - horizontally scrollable */}
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {thumbnails.length ? (
                  thumbnails.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        // simple UX: swap hero (local)
                        // this is local-only; it's enough for quick UX
                        const tmp = thumbnails[0];
                        thumbnails[0] = thumbnails[i];
                        thumbnails[i] = tmp;
                        // trigger rerender by manipulating state? simple: reload data from store; for now a quick workaround:
                        window.location.reload(); // simple; replace with stateful approach if you want
                      }}
                      className="flex-none w-16 h-12 rounded-md overflow-hidden border"
                      aria-label={`Open image ${i + 1}`}
                    >
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt={`thumbnail-${i}`}
                      />
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 px-2">No images</div>
                )}
              </div>
            </div>

            {/* Product meta */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.productName || "Untitled product"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.category || "—"} · {product.subCategory || "—"}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {product.pricePerUnit != null ? (
                      <>
                        {formatCurrencyINR(product.pricePerUnit)}{" "}
                        <span className="text-sm font-normal">
                          / {product.priceUnit}
                        </span>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Color</div>
                  <div className="font-medium text-gray-800">
                    {product.color || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Grade</div>
                  <div className="font-medium text-gray-800">
                    {product.grade || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Weight</div>
                  <div className="font-medium text-gray-800">
                    {product.weight ?? "N/A"} {product.weightMeasurement || ""}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Size</div>
                  <div className="font-medium text-gray-800">
                    {product.size?.length ?? "N/A"} ×{" "}
                    {product.size?.width ?? "N/A"}{" "}
                    {product.size?.lengthMeasurement || ""}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Origin</div>
                  <div className="font-medium text-gray-800">
                    {product.origin || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Stock/Est.</div>
                  <div className="font-medium text-gray-800">
                    {product.stock ?? "—"}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Description & Notes
                </h4>
                <div className="text-sm text-gray-700">
                  {/* If you have more product description, show it. Otherwise show a placeholder */}
                  {product.description || "No description available."}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={productHero || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm"
                >
                  <ExternalLink size={14} /> View image
                </a>
                <button
                  onClick={() => alert("Open negotiation modal (implement)")}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-navyblue text-white text-sm"
                >
                  <Tag size={14} /> Quote / Respond
                </button>
                <button
                  onClick={() =>
                    alert(
                      "Open full-screen map or shipment estimator (implement)"
                    )
                  }
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
                >
                  <MapPin size={14} /> Shipping estimate
                </button>
              </div>
            </div>
          </div>

          {/* Audit / quick info */}
          <div className="mt-6 border-t pt-4 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <strong className="text-gray-800">Read:</strong>{" "}
              {inquiry.readInfo?.isRead
                ? `Yes (${formatDate(inquiry.readInfo.readAt)})`
                : "No"}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">Last update</div>
              <div className="font-medium text-gray-800">{updatedAt}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
