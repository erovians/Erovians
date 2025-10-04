// export default ProductDetails;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/axios.utils";
import { MoreVertical, Trash2 } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedImg, setSelectedImg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data.data);
        setEditData(res.data.data);
        if (res.data.data.productImages?.length > 0) {
          setSelectedImg(res.data.data.productImages[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!product) return;
    const newStatus = product.status === "active" ? "inactive" : "active";
    try {
      await api.patch(`/product/${product._id}/status`, { status: newStatus });
      setProduct({ ...product, status: newStatus });
      setEditData({ ...editData, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await api.delete(`/product/${product._id}`);
      navigate("/sellerdashboard/products/list");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...editData };
      if (newImages.length > 0) {
        updatedData.productImages = [
          ...(editData.productImages || []),
          ...newImages,
        ];
      }

      const res = await api.put(`/product/${product._id}`, updatedData);
      setProduct(res.data.data);
      setEditData(res.data.data);
      setIsEditing(false);
      setNewImages([]);
      if (res.data.data.productImages?.length > 0) {
        setSelectedImg(res.data.data.productImages[0]);
      }
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product.");
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...editData.productImages];
    updatedImages.splice(index, 1);
    setEditData({ ...editData, productImages: updatedImages });

    if (selectedImg === editData.productImages[index]) {
      setSelectedImg(updatedImages[0] || "");
    }
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setNewImages([...newImages, ...urls]);
  };

  if (!product)
    return <div className="p-6 text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-full mx-auto p-6 rounded-xl relative">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Thumbnails + Main Image */}
        <div className="md:w-1/2 flex gap-4">
          <div className="flex flex-col gap-3 w-20 overflow-y-auto">
            {editData.productImages?.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt={`${product.productName}-${idx}`}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 object-contain border rounded-lg cursor-pointer p-1 transition ${
                    selectedImg === img
                      ? "border-blue-600 shadow-md"
                      : "border-gray-200"
                  }`}
                />
                {isEditing && (
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {newImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt={`new-${idx}`}
                  onClick={() => setSelectedImg(img)}
                  className="w-20 h-20 object-contain border rounded-lg p-1"
                />
                {isEditing && (
                  <button
                    onClick={() =>
                      setNewImages(newImages.filter((_, i) => i !== idx))
                    }
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {isEditing && (
              <label className="cursor-pointer w-20 h-20 flex items-center justify-center border rounded-lg text-gray-500 hover:bg-gray-100">
                + Add
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAddImages}
                />
              </label>
            )}
          </div>

          <div className="flex-1 rounded-xl flex items-center justify-center">
            <img
              src={selectedImg}
              alt={product.productName}
              className="max-h-[450px] object-contain p-4"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 flex flex-col p-6 rounded-2xl font-sans text-gray-800 relative">
          {/* Header: Product Name + Status + Menu */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.productName}
                  onChange={(e) =>
                    setEditData({ ...editData, productName: e.target.value })
                  }
                  className="text-3xl font-bold tracking-tight text-gray-900 border-b p-1 w-full"
                />
              ) : (
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {product.productName}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Status Toggle */}
              <button
                onClick={handleToggleStatus}
                className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 focus:outline-none ${
                  product.status === "active" ? "bg-green-500" : "bg-red-600"
                }`}
              >
                <span
                  className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
                    product.status === "active"
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {product.status}
              </span>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {/* Price */}
            <div className="flex items-baseline gap-3 border-b border-gray-200 pb-3">
              {isEditing ? (
                <>
                  <input
                    type="number"
                    value={editData.pricePerUnit}
                    onChange={(e) =>
                      setEditData({ ...editData, pricePerUnit: e.target.value })
                    }
                    className="text-2xl font-extrabold border p-1 w-28"
                  />
                  <input
                    type="text"
                    value={editData.unit}
                    onChange={(e) =>
                      setEditData({ ...editData, unit: e.target.value })
                    }
                    className="text-base border p-1 w-20"
                  />
                </>
              ) : (
                <>
                  <span className="text-3xl font-extrabold text-black">
                    ₹{product.pricePerUnit}
                  </span>
                  <span className="text-base text-gray-500">
                    /{product.unit}
                  </span>
                </>
              )}
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Specifications
              </h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                {[
                  "category",
                  "subCategory",
                  "grade",
                  "color",
                  "origin",
                  "size.length",
                  "size.width",
                  "size.thickness",
                  "weight",
                ].map((field, idx) => {
                  const keys = field.split(".");
                  const value =
                    keys.length === 2
                      ? editData[keys[0]]?.[keys[1]]
                      : editData[field];
                  return (
                    <li key={idx} className="flex items-center">
                      <span className="font-medium capitalize w-32">
                        {keys.join(" ")}:
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={value || ""}
                          onChange={(e) => {
                            if (keys.length === 2) {
                              setEditData({
                                ...editData,
                                [keys[0]]: {
                                  ...editData[keys[0]],
                                  [keys[1]]: e.target.value,
                                },
                              });
                            } else {
                              setEditData({
                                ...editData,
                                [field]: e.target.value,
                              });
                            }
                          }}
                          className="border p-1 text-sm flex-1"
                        />
                      ) : (
                        <span className="text-gray-600">{value || "N/A"}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                Description
              </h2>
              {isEditing ? (
                <textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full border p-2 text-sm"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed text-sm">
                  {product.description || "No description available."}
                </p>
              )}
            </div>
          </div>

          {/* Sticky Save Button */}
          {isEditing && (
            <div className="  transform mt-10 ">
              <button
                onClick={handleSave}
                className="bg-gray-600 cursor-pointer text-white px-6 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
