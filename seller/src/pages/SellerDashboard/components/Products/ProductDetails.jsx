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
        <div className="md:w-1/2 flex flex-col space-y-6 p-6  rounded-2xl ">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">
            {product.productName}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-black">
              ₹{product.pricePerUnit}
            </span>
            <span className="text-base text-gray-500">/{product.unit}</span>
          </div>

          {/* Details */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm">
            <li>
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </li>
            <li>
              <span className="font-semibold">Grade:</span> {product.grade}
            </li>
            <li>
              <span className="font-semibold">Color:</span>{" "}
              {product.color || "N/A"}
            </li>
            <li>
              <span className="font-semibold">Origin:</span>{" "}
              {product.origin || "N/A"}
            </li>
            <li>
              <span className="font-semibold">Length:</span>{" "}
              {product.size?.length || "N/A"}
            </li>
            <li>
              <span className="font-semibold">Width:</span>{" "}
              {product.size?.width || "N/A"}
            </li>
            <li>
              <span className="font-semibold">Thickness:</span>{" "}
              {product.size?.thickness || "N/A"}
            </li>
            <li>
              <span className="font-semibold">Weight:</span>{" "}
              {product.weight || "N/A"}
            </li>
          </ul>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Action Button */}
          {/* <button className="self-start px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            Buy Now
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
