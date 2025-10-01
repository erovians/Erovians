import React, { useEffect, useState } from "react";
import api from "@/utils/axios.utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ListProducts = ({ companyId = "651234abcd5678ef90123456" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/product/list", {
          params: { companyId },
        });
        setProducts(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchProducts();
  }, [companyId]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!products.length) return <p>No products found for this company.</p>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden max-w-[400px] max-h-[500px] w-full mx-auto"
        >
          {/* Product Images Carousel */}
          {product.productImages && product.productImages.length > 0 ? (
            <Carousel className="w-full h-[220px] rounded-t-2xl relative">
              <CarouselContent>
                {product.productImages.map((img, idx) => (
                  <CarouselItem
                    key={idx}
                    className="flex items-center justify-center"
                  >
                    <img
                      src={img}
                      alt={`${product.productName} - ${idx + 1}`}
                      className="w-full h-[220px] object-cover rounded-t-2xl"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Optional Arrows */}
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white rounded-full shadow flex items-center justify-center cursor-pointer" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white rounded-full shadow flex items-center justify-center cursor-pointer" />
            </Carousel>
          ) : (
            <div className="w-full h-[220px] flex items-center justify-center bg-gray-100 text-gray-400 rounded-t-2xl">
              No Image
            </div>
          )}

          {/* Product Details */}
          <div className="p-4 h-[280px] flex flex-col justify-between">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
              {product.productName}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                {product.category}
              </span>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                Grade {product.grade}
              </span>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-600 mb-2 space-y-1">
              <p>
                <span className="font-medium">SubCategory:</span>{" "}
                {product.subCategory || "N/A"}
              </p>
              <p>
                <span className="font-medium">Color:</span> {product.color}
              </p>
              <p>
                <span className="font-medium">Origin:</span> {product.origin}
              </p>
              <p>
                <span className="font-medium">Size:</span>{" "}
                {product.size?.length} × {product.size?.width} ×{" "}
                {product.size?.thickness}
              </p>
            </div>

            {/* Price */}
            <div className="mt-2 flex justify-between items-center">
              <span className="text-lg font-bold text-emerald-600">
                ${product.pricePerUnit} / {product.unit}
              </span>
              <button className="px-3 py-1.5 text-sm bg-navyblue text-white rounded-lg shadow hover:bg-blue-800 transition">
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListProducts;
