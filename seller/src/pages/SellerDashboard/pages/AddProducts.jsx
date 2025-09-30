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
      // Reset form after successful submission
      setFormData({
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

        {/* Product Images */}
        <div className="space-y-2">
          <label className="font-medium">Product Images (Min 3)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setFormData((prev) => ({
                ...prev,
                productImages: files, // store all files selected
              }));
            }}
            className="w-full border p-3 rounded-lg"
          />

          {/* Validation message if less than 3 */}
          {formData.productImages.length > 0 &&
            formData.productImages.length < 3 && (
              <p className="text-red-500 text-sm">
                Please select at least 3 images.
              </p>
            )}
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
          className="w-full bg-gray-600 cursor-pointer text-white py-3 rounded-lg shadow hover:bg-gray-700 transition"
        >
          {loading ? "Submitting..." : "Add Product"}
        </button>
      </form>

      <div className=" rounded-3xl overflow-hidden h-fit border border-gray-200 max-w-xl mx-auto">
        {/* Header */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-white text-center">
            🛍️ Product Overview
          </h3>
        </div>

        {/* Images Carousel */}
        {formData.productImages.length > 0 ? (
          <div className="flex overflow-x-auto gap-3 p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {formData.productImages.map((img, idx) => (
              <img
                key={idx}
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                alt={`Product ${idx + 1}`}
                className="h-48 w-64 object-cover rounded-xl flex-shrink-0 shadow-md"
              />
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400 font-medium">
            No Images
          </div>
        )}

        {/* Product Info */}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {formData.productName || "Product Name"}
          </h2>

          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800  px-3 py-1 rounded-full text-sm">
              Category: {formData.category}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              SubCategory: {formData.subCategory || "N/A"}
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              Grade: {formData.grade}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <p>
              <span className="font-semibold">Color:</span>{" "}
              {formData.color || "-"}
            </p>
            <p>
              <span className="font-semibold">Origin:</span>{" "}
              {formData.origin || "-"}
            </p>
            <p>
              <span className="font-semibold">Length:</span>{" "}
              {formData.size.length || "-"}
            </p>
            <p>
              <span className="font-semibold">Width:</span>{" "}
              {formData.size.width || "-"}
            </p>
            <p>
              <span className="font-semibold">Thickness:</span>{" "}
              {formData.size.thickness || "-"}
            </p>
            <p>
              <span className="font-semibold">Weight:</span>{" "}
              {formData.weight || "-"}
            </p>
          </div>

          <p className="text-gray-800 font-semibold mt-2">
            Price:{" "}
            <span className="text-red-600">
              ${formData.pricePerUnit || "-"} / {formData.unit}
            </span>
          </p>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-1">Description:</h4>
            <p className="text-gray-600">
              {formData.description ||
                "Product description will appear here..."}
            </p>
          </div>

          {/* Footer */}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
