import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/axios.utils"; // your axios instance

const ProductDetails = () => {
  const { id } = useParams(); // get product id from URL
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data.data);
        if (res.data.data.productImages?.length > 0) {
          setSelectedImg(res.data.data.productImages[0]); // default image
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 rounded-xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Thumbnails + Main Image */}
        <div className="md:w-1/2 flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3 w-20 overflow-y-auto">
            {product.productImages?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.productName}-${idx}`}
                onClick={() => setSelectedImg(img)}
                className={`w-20 h-20 object-contain border rounded-lg cursor-pointer p-1 transition ${
                  selectedImg === img
                    ? "border-blue-600 shadow-md"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1  rounded-xl flex items-center justify-center ">
            <img
              src={selectedImg}
              alt={product.productName}
              className="max-h-[450px] object-contain p-4"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 flex flex-col">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800">
            {product.productName}
          </h1>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">
              ₹{product.pricePerUnit}
            </span>
            <span className="text-sm text-gray-500">/{product.unit}</span>
          </div>

          {/* Details */}
          <ul className="mt-4 text-sm text-gray-700 space-y-2">
            <li>
              <span className="font-medium">Category:</span> {product.category}
            </li>
            <li>
              <span className="font-medium">Grade:</span> {product.grade}
            </li>
            <li>
              <span className="font-medium">Color:</span> {product.color}
            </li>
            <li>
              <span className="font-medium">Origin:</span>{" "}
              {product.origin || "N/A"}
            </li>
            <li>
              <span className="font-medium">Size:</span> {product.size?.length}{" "}
              × {product.size?.width} × {product.size?.thickness}
            </li>
            <li>
              <span className="font-medium">Weight:</span>{" "}
              {product.weight || "N/A"}
            </li>
          </ul>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">Description</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Action Button */}
          <button className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition w-fit">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
