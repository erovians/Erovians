import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/axios.utils";
import { MoreVertical, Trash2 } from "lucide-react";
import { set } from "zod";
import { Spinner } from "@/components/ui/spinner";

const ProductDetails = () => {
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      await api.patch(`/product/${product.id}/status`, { status: newStatus });
      setProduct({ ...product, status: newStatus });
      setEditData({ ...editData, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      setLoading(true);
      await api.delete(`/product/${product.id}`);
      navigate("/sellerdashboard/products/list");
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = { ...editData };
      if (newImages.length > 0) {
        updatedData.productImages = [
          ...(editData.productImages || []),
          ...newImages,
        ];
      }

      const res = await api.put(`/product/${product.id}`, updatedData);
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
    } finally {
      setLoading(false);
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
    <div className="max-w-full  rounded-xl relative">
      <div className="flex flex-col md:flex-row gap-8 w-full md:h-auto">
        {/* Left: Thumbnails + Main Image */}
        <div className="flex flex-col md:flex-row gap-4 md:w-[50%]">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto w-full md:w-20">
            {editData.productImages?.map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0">
                <img
                  src={img}
                  alt={`${product.productName}-${idx}`}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-14  object-contain border rounded-lg cursor-pointer p-1 transition ${
                    selectedImg === img
                      ? "border-blue-600  shadow-md"
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
              <div key={idx} className="relative flex-shrink-0">
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
              <label className="cursor-pointer w-20 h-20 flex-shrink-0 flex items-center justify-center border rounded-lg text-gray-500 hover:bg-gray-100">
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

          {/* Main Image */}
          <div className="flex-1 rounded-xl flex items-center justify-center">
            <img
              src={selectedImg}
              alt={product.productName}
              className="max-h-[450px] min-h-[250px]  object-contain p-4 w-full"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 flex flex-col p-6 rounded-2xl font-sans text-gray-800 relative">
          {/* Header: Product Name + Status + Menu */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
            {/* Product Title */}
            <div className="flex-1 w-full">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.productName}
                  onChange={(e) =>
                    setEditData({ ...editData, productName: e.target.value })
                  }
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 border-b p-1 w-full"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  {product.productName}
                </h1>
              )}
            </div>

            {/* Status + Menu (for medium and large screens) */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-wrap mt-2 sm:mt-0">
              {/* Status Toggle */}
              {(product.status === "active" ||
                product.status === "inactive") && (
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
              )}

              {/* Status Label */}
              <span
                className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                  product.status === "active"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : product.status === "inactive"
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : product.status === "pending"
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    : "bg-purple-100 text-purple-700 border border-purple-300"
                }`}
              >
                {product.status.charAt(0).toUpperCase() +
                  product.status.slice(1)}
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

          {/* ✅ Small screen layout for Price + Status + Menu */}
          <div className="flex sm:hidden items-center justify-between mb-4 flex-wrap gap-2">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              {isEditing ? (
                <>
                  <input
                    type="number"
                    value={editData.pricePerUnit}
                    onChange={(e) =>
                      setEditData({ ...editData, pricePerUnit: e.target.value })
                    }
                    className="text-lg font-semibold border p-1 w-20"
                  />
                  <input
                    type="text"
                    value={editData.priceUnit}
                    onChange={(e) =>
                      setEditData({ ...editData, priceUnit: e.target.value })
                    }
                    className="text-sm border p-1 w-16"
                  />
                </>
              ) : (
                <>
                  <span className="text-xl font-bold text-black">
                    ₹{product.pricePerUnit}
                  </span>
                  <span className="text-sm text-gray-500">
                    /{product.priceUnit}
                  </span>
                </>
              )}
            </div>

            {/* Status + Menu */}
            <div className="flex items-center gap-2">
              {(product.status === "active" ||
                product.status === "inactive") && (
                <button
                  onClick={handleToggleStatus}
                  className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors duration-300 focus:outline-none ${
                    product.status === "active" ? "bg-green-500" : "bg-red-600"
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
                      product.status === "active"
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              )}

              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  product.status === "active"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : product.status === "inactive"
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : product.status === "pending"
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    : "bg-purple-100 text-purple-700 border border-purple-300"
                }`}
              >
                {product.status.charAt(0).toUpperCase() +
                  product.status.slice(1)}
              </span>

              {/* Menu (same as large) */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100"
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
            <div className="hidden sm:flex items-baseline gap-3 border-b border-gray-200 pb-3">
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
                    value={editData.priceUnit}
                    onChange={(e) =>
                      setEditData({ ...editData, priceUnit: e.target.value })
                    }
                    className="text-base border p-1 w-20"
                  />
                </>
              ) : (
                <>
                  <span className="text-3xl text-black">
                    ₹{product.pricePerUnit}
                  </span>
                  <span className="text-base text-gray-500">
                    /{product.priceUnit}
                  </span>
                </>
              )}
            </div>

            {/* Specifications */}
            {/* Specifications */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Specifications
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-700">
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

                  let unit = "";
                  if (field === "size.length")
                    unit = editData.size?.lengthMeasurement || "";
                  if (field === "size.width")
                    unit = editData.size?.widthMeasurement || "";
                  if (field === "size.thickness")
                    unit = editData.size?.thicknessMeasurement || "";
                  if (field === "weight")
                    unit = editData.weightMeasurement || "";

                  return (
                    <li
                      key={idx}
                      className="flex items-center justify-between w-fit  gap-14 capitalize"
                    >
                      <span className="font-medium capitalize w-24 sm:w-32 text-xs sm:text-sm">
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
                          className="border p-1 text-xs sm:text-sm flex-1"
                        />
                      ) : (
                        <span className="text-gray-600 text-xs sm:text-sm">
                          {value || "N/A"} {unit}
                        </span>
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
                  className="w-full h-40 border  p-2 text-sm"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 hide-scrollbar leading-relaxed text-sm max-h-[300px] scroll-smooth  overflow-y-auto overflow-x-hidden">
                  {product.description || "No description available."}
                </p>
              )}
            </div>
          </div>

          {/* Sticky Save Button */}
          {isEditing && (
            <div className=" transform mt-10 ">
              <button
                onClick={handleSave}
                className="flex items-center gap-3 bg-navyblue border border-navyblue text-white px-6 py-2 rounded-md shadow-lg cursor-pointer hover:bg-white hover:text-navyblue transition"
              >
                {loading && <Spinner />}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
