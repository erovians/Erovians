import React, { useState } from "react";
import api from "@/utils/axios.utils";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    companyId: "",
    productName: "",
    productImages: ["", "", ""],
    category: "Granite",
    subCategory: "",
    grade: "A",
    color: "",
    origin: "",
    size: { length: "", width: "", thickness: "" },
    weight: "",
    pricePerUnit: "",
    unit: "sq.ft",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["length", "width", "thickness"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        size: { ...prev.size, [name]: value },
      }));
    } else if (name.startsWith("image")) {
      const index = parseInt(name.split("-")[1]);
      const updatedImages = [...formData.productImages];
      updatedImages[index] = value;
      setFormData((prev) => ({
        ...prev,
        productImages: updatedImages,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/product/add", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* Left side: Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5 ">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🛒 Add New Product
        </h2>

        {message && (
          <div className="p-3 text-sm rounded bg-green-100 text-green-700 border border-green-300">
            {message}
          </div>
        )}

        <input
          type="text"
          name="companyId"
          placeholder="Company ID"
          value={formData.companyId}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <div className="space-y-2">
          <label className="font-medium">Product Images</label>
          {formData.productImages.map((img, idx) => (
            <input
              key={idx}
              type="text"
              name={`image-${idx}`}
              placeholder={`Image URL ${idx + 1}`}
              value={img}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="Granite">Granite</option>
            <option value="Marble">Marble</option>
          </select>

          <input
            type="text"
            name="subCategory"
            placeholder="Sub Category"
            value={formData.subCategory}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
        </div>

        <select
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
        </select>

        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="origin"
          placeholder="Origin"
          value={formData.origin}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            name="length"
            placeholder="Length"
            value={formData.size.length}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
          <input
            type="number"
            name="width"
            placeholder="Width"
            value={formData.size.width}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
          <input
            type="number"
            name="thickness"
            placeholder="Thickness"
            value={formData.size.thickness}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            name="weight"
            placeholder="Weight"
            value={formData.weight}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
          <input
            type="number"
            name="pricePerUnit"
            placeholder="Price Per Unit"
            value={formData.pricePerUnit}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="sq.ft">sq.ft</option>
            <option value="sq.m">sq.m</option>
            <option value="piece">piece</option>
          </select>
        </div>

        <textarea
          name="description"
          placeholder="Product description..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Add Product"}
        </button>
      </form>

      {/* Right side: Preview */}
      <div className="rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Live Preview</h3>

        {formData.productImages[0] ? (
          <img
            src={formData.productImages[0]}
            alt="preview"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4 text-gray-500">
            No Image
          </div>
        )}

        <h4 className="text-xl font-semibold">
          {formData.productName || "Product Name"}
        </h4>
        <p className="text-gray-500">
          {formData.category} • {formData.subCategory}
        </p>
        <p className="text-gray-700 mt-2">
          {formData.description || "Product description will appear here..."}
        </p>
        <p className="text-blue-600 font-bold mt-3">
          {formData.pricePerUnit
            ? `$${formData.pricePerUnit} / ${formData.unit}`
            : ""}
        </p>
      </div>
    </div>
  );
};

export default AddProduct;
