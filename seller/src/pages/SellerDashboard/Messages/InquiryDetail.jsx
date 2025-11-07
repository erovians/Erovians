import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchInquiryById } from "../../../redux/slice/inquirySlice";
import { MessageCircle } from "lucide-react";

const InquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedInquiry: q,
    loading,
    error,
  } = useSelector((state) => state.inquiries);

  useEffect(() => {
    dispatch(fetchInquiryById(id));
  }, [dispatch, id]);

  if (loading)
    return <p className="text-center text-gray-500">Loading inquiry...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!q)
    return <p className="text-center text-gray-600">Inquiry not found.</p>;
  return (
    <div className="w-full h-fit rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <div>
          <p className="text-xs text-gray-600">
            Inquiry ID:{" "}
            <span className="text-gray-800 font-medium">
              {q._id?.slice(-6) || "N/A"}
            </span>
          </p>
        </div>
        <p className="text-xs text-gray-600">
          Date:{" "}
          <span className="font-medium text-gray-800">
            {new Date(q.createdAt).toLocaleString()}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap md:flex-nowrap justify-between gap-6 p-6 items-stretch">
        <div className="bg-gray-50 rounded-xl p-6 flex-1 flex flex-col justify-between min-w-[280px]">
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4">
              Buyer Details
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Buyer Name</p>
                <p className="font-medium text-gray-800">
                  {q.userId?.name || "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Buyer ID</p>
                <p className="font-medium text-gray-800">
                  {q.userId.slice(-6) || "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-800">
                  {q.userId?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="font-medium text-gray-800">
                  {q.quantity} {q.unitType}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Message</p>
                <p className="text-sm text-gray-700 italic">
                  {q.message || "No message provided."}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p
                  className={`inline-block px-2 py-1 rounded-md text-xs font-medium mt-1 ${
                    q.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {q.status || "Ongoing"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 flex-1 flex flex-col justify-between min-w-[280px]">
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4">
              Product Details
            </h4>

            <div className="flex gap-2 mb-4 overflow-x-auto">
              {q.productId?.productImages?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="product"
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Product Name</p>
                <p className="font-medium text-gray-800">
                  {q.productId?.productName || "Untitled Product"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-medium text-gray-800">
                  {q.productId?.category || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Subcategory</p>
                <p className="font-medium text-gray-800">
                  {q.productId?.subCategory || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Origin</p>
                <p className="font-medium text-gray-800">
                  {q.productId?.origin || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-medium text-gray-800">
                  ₹{q.productId?.pricePerUnit} / {q.productId?.priceUnit}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Color</p>
                <p className="font-medium text-gray-800">
                  {q.productId?.color || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Grade</p>
                <p className="font-medium text-gray-800">
                  {q.productId?.grade || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Weight</p>
                <p className="font-medium text-gray-800">
                  {q.productId?.weight || "N/A"}{" "}
                  {q.productId?.weightMeasurement || ""}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Size</p>
                <p className="font-medium text-gray-800">
                  {q.productId?.size?.length || "N/A"} ×{" "}
                  {q.productId?.size?.width || "N/A"}{" "}
                  {q.productId?.size?.lengthMeasurement || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 px-6 pb-8 mt-2">
        <button
          onClick={() => navigate(`/sellerdashboard/chats/${q.userId}`)}
          // onClick={() => alert("Please wait ,chat will be avilable soon !!")}
          className="flex items-center gap-2 bg-navyblue text-white border border-navyblue  px-5 py-2 rounded-xl text-sm font-medium hover:bg-white hover:text-navyblue  transition"
        >
          <MessageCircle size={24} />
          Chat Now
        </button>
      </div>
    </div>
  );
};

export default InquiryDetail;
