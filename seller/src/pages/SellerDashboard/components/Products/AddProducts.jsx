import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, clearMessage } from "../../../../redux/slice/productSlice";
import { Spinner } from "@/components/ui/spinner";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { product, loading, message, error } = useSelector(
    (state) => state.products || {}
  );

  const [formData, setFormData] = useState({
    companyId: "",
    productName: "",
    productImages: [],
    category: "Granite",
    subCategory: "",
    grade: "A",
    color: "",
    origin: "",
    size: {
      length: "",
      lengthMeasurement: "ft",
      width: "",
      widthMeasurement: "ft",
      thickness: "",
      thicknessMeasurement: "inch",
    },
    weight: "",
    weightMeasurement: "kg",
    pricePerUnit: "",
    priceUnit: "sq.ft",
    description: "",
  });

  // Clear message after 3s
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["length", "width", "thickness"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        size: { ...prev.size, [name]: value },
      }));
    } else if (
      [
        "lengthMeasurement",
        "widthMeasurement",
        "thicknessMeasurement",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        size: { ...prev.size, [name]: value },
      }));
    } else if (
      ["weight", "weightMeasurement", "pricePerUnit", "priceUnit"].includes(
        name
      )
    ) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...files],
    }));
    console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "size") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === "productImages") {
        formData[key].forEach((file) =>
          formDataToSend.append("productImages", file)
        );
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const result = await dispatch(addProduct(formDataToSend)).unwrap();

      // Reset form only after success
      setFormData({
        companyId: "",
        productName: "",
        productImages: [],
        category: "Granite",
        subCategory: "",
        grade: "A",
        color: "",
        origin: "",
        size: {
          length: "",
          lengthMeasurement: "ft",
          width: "",
          widthMeasurement: "ft",
          thickness: "",
          thicknessMeasurement: "inch",
        },
        weight: "",
        weightMeasurement: "kg",
        pricePerUnit: "",
        priceUnit: "sq.ft",
        description: "",
      });

      alert(result.message || "Product added successfully!");
    } catch (err) {
      alert(err || "Something went wrong");
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 grid md:grid-cols-2 gap-8 ">
      {/* Left side: Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Add New Product
        </h2>

        {message && (
          <div className="p-3 text-sm rounded bg-green-100 text-green-700 border border-green-300 text-center">
            {message}
          </div>
        )}

        {/* Company & Product Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="companyId"
            placeholder="Company ID"
            value={formData.companyId}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
          />

          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
          />
        </div>

        {/* Product Images */}
        <div>
          <label className="font-medium text-gray-700">
            Product Images (Min 3)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-3 mt-2 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
          />

          {formData.productImages.length > 0 &&
            formData.productImages.length < 3 && (
              <p className="text-red-500 text-sm mt-1">
                Please select at least 3 images.
              </p>
            )}

          {formData.productImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {formData.productImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt={`Preview ${idx + 1}`}
                    className="h-20 w-20 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        productImages: prev.productImages.filter(
                          (_, i) => i !== idx
                        ),
                      }))
                    }
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
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
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
          />
        </div>

        {/* Grade */}
        <select
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
        >
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
        </select>

        {/* Color & Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={formData.color}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
          />

          <input
            type="text"
            name="origin"
            placeholder="Origin"
            value={formData.origin}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
          />
        </div>

        {/* Size Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Size Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex gap-2">
              <input
                type="number"
                name="length"
                placeholder="Length"
                value={formData.size.length}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-2/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              />
              <select
                name="lengthMeasurement"
                value={formData.size.lengthMeasurement}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-1/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              >
                <option value="ft">ft</option>
                <option value="m">m</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                name="width"
                placeholder="Width"
                value={formData.size.width}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-2/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              />
              <select
                name="widthMeasurement"
                value={formData.size.widthMeasurement}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-1/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              >
                <option value="ft">ft</option>
                <option value="m">m</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                name="thickness"
                placeholder="Thickness"
                value={formData.size.thickness}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-2/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              />
              <select
                name="thicknessMeasurement"
                value={formData.size.thicknessMeasurement}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-1/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              >
                <option value="inch">inch</option>
                <option value="cm">cm</option>
              </select>
            </div>
          </div>
        </div>

        {/* Weight & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={formData.weight}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-2/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
            <select
              name="weightMeasurement"
              value={formData.weightMeasurement}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-1/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            >
              <option value="kg">kg</option>
              <option value="ton">ton</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              name="pricePerUnit"
              placeholder="Price Per Unit"
              value={formData.pricePerUnit}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-2/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
            <select
              name="priceUnit"
              value={formData.priceUnit}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-1/3 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            >
              <option value="sq.ft">sq.ft</option>
              <option value="sq.m">sq.m</option>
              <option value="piece">piece</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product description..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className=" flex  justify-center items-center gap-3 w-full border border-navyblue bg-navyblue text-white py-3 rounded-lg shadow hover:bg-white hover:text-navyblue cursor-pointer transition disabled:opacity-50"
        >
          {loading && <Spinner />}
          {loading ? "Submitting" : "Add Product"}
        </button>
      </form>

      {/* Preview Section */}
      <div className="min-w-full h-[25%] mx-auto bg-white border rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 h-full p-2 flex flex-col">
          <div className=" rounded-lg overflow-hidden flex-1 mb-1">
            <img
              src={
                formData.productImages.length > 0
                  ? typeof formData.productImages[0] === "string"
                    ? formData.productImages[0]
                    : URL.createObjectURL(formData.productImages[0])
                  : "https://img.freepik.com/free-photo/solid-painted-concrete-wall-textured-backdrop_53876-110679.jpg?semt=ais_hybrid&w=740&q=80"
              }
              alt="Main Product"
              className="w-full h-full object-contain"
            />
          </div>

          {formData.productImages.length > 1 && (
            <div className="flex gap-1 overflow-x-auto mt-1">
              {formData.productImages.map((img, idx) => (
                <img
                  key={idx}
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-12 h-12 object-contain rounded border cursor-pointer hover:ring-2 hover:ring-yellow-500"
                  onClick={() => {
                    const newImages = [...formData.productImages];
                    [newImages[0], newImages[idx]] = [
                      newImages[idx],
                      newImages[0],
                    ];
                    setFormData({ ...formData, productImages: newImages });
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 h-full p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
              {formData.productName || "Product Name"}
            </h2>

            <div className="flex flex-wrap gap-5 mb-1">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {formData.category}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                {formData.subCategory || "N/A"}
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                {formData.grade}
              </span>
            </div>

            <div className="grid grid-cols-2 mt-5 gap-3 text-gray-700 mb-1 text-xs">
              <p>
                <span className="text-gray-400">Color:</span>{" "}
                {formData.color || "-"}
              </p>
              <p>
                <span className="text-gray-400">Origin:</span>{" "}
                {formData.origin || "-"}
              </p>
              <p>
                <span className="text-gray-400">Length:</span>{" "}
                {formData.size.length || "-"} {formData.size.lengthMeasurement}
              </p>
              <p>
                <span className="text-gray-400">Width:</span>{" "}
                {formData.size.width || "-"} {formData.size.widthMeasurement}
              </p>
              <p>
                <span className="text-gray-400">Thickness:</span>{" "}
                {formData.size.thickness || "-"}{" "}
                {formData.size.thicknessMeasurement}
              </p>
              <p>
                <span className="text-gray-400">Weight:</span>{" "}
                {formData.weight || "-"} {formData.weightMeasurement}
              </p>
            </div>

            <p className="text-lg md:text-xs font-bold  mb-1">
              Price/Unit:{" "}
              <span className="text-green-600">
                ${formData.pricePerUnit || "-"} / {formData.priceUnit}
              </span>
            </p>

            <p className="text-gray-600 text-xs line-clamp-3">
              {formData.description ||
                "Product description will appear here..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
