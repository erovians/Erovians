import api from "@/utils/axios.utils";
import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function AddLotModal({ open, setOpen, refresh }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const blockedFields = [
    "lot",
    "thickness",
    "dimensions",
    "location",
    "quality",
  ];

  const [form, setForm] = useState({
    lot: "",
    material: "",
    thickness: "",
    dimensions: "",
    location: "",
    quality: "",
    qty: "",
  });

  // Fetch current seller products for dropdown
  const fetchProducts = async () => {
    try {
      const res = await api.get("/product/mine");
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error loading products", err);
    }
  };

  useEffect(() => {
    if (open) fetchProducts();
  }, [open]);

  // Auto-fill form when material (product) is selected
  const handleMaterialSelect = (productName) => {
    const product = products.find((p) => p.productName === productName);

    if (!product) return;

    setForm((prev) => ({
      ...prev,
      lot: product.id.slice(-6),
      material: product.productName,
      thickness: product.size?.thickness || "",
      dimensions: `${product.size?.length} x ${product.size?.width}` || "",
      location: product.origin || "",
      quality: product.grade || "",
      qty: "",
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/stocks/create", form);
      refresh();
      setOpen(false);
    } catch (err) {
      console.error("Error creating stock:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
          Add New Lot
        </h2>

        <div className="space-y-4">
          {/* MATERIAL DROPDOWN */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Material
            </label>

            <select
              className="border rounded-xl px-4 py-2.5 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-navyblue outline-none transition-all"
              value={form.material}
              onChange={(e) => handleMaterialSelect(e.target.value)}
            >
              <option value="">Select Material</option>

              {products.map((p) => (
                <option
                  key={p.id}
                  value={p.productName}
                  className="bg-black text-white"
                >
                  {p.productName}
                </option>
              ))}
            </select>
          </div>

          {/* OTHER FIELDS (auto-filled if material selected) */}
          {Object.keys(form).map(
            (key) =>
              key !== "material" && (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key}
                  </label>

                  <input
                    placeholder={`Enter ${key}`}
                    className={`border rounded-xl px-4 py-2.5 transition-all outline-none
            ${
              blockedFields.includes(key)
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-gray-50 focus:bg-white focus:ring-2 focus:ring-navyblue"
            }`}
                    value={form[key]}
                    onChange={(e) =>
                      !blockedFields.includes(key) &&
                      setForm({ ...form, [key]: e.target.value })
                    }
                    readOnly={blockedFields.includes(key)}
                  />
                </div>
              )
          )}
        </div>

        <div className="flex justify-end mt-8 gap-3">
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2 justify-center
    ${
      loading
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-navyblue text-white hover:bg-navyblue/90"
    }`}
          >
            <span>{loading ? "Saving " : "Save"}</span>
            {loading && <Spinner size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
