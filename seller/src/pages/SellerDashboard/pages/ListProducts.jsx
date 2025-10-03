import React, { useEffect, useState } from "react";
import api from "@/utils/axios.utils";
import { Link } from "react-router-dom";
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
    <div className="space-y-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          {/* Left: Product Images */}
          <div className="md:w-2/4 w-full h-[280px] relative flex items-center justify-center ">
            {product.productImages && product.productImages.length > 0 ? (
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {product.productImages.map((img, idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex items-center justify-center"
                    >
                      <img
                        src={img}
                        alt={`${product.productName} - ${idx + 1}`}
                        className="w-full h-[280px] object-contain"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-white" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-white" />
              </Carousel>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <Link
            key={product._id}
            to={`/sellerdashboard/product/${product._id}`}
            className="md:w-full w-full p-6 flex flex-col justify-between"
          >
            <div>
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800">
                {product.productName}
              </h3>

              {/* Highlights */}
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                <li>
                  <span className="font-medium">Category:</span>{" "}
                  {product.category}
                </li>
                <li>
                  <span className="font-medium">Grade:</span> {product.grade}
                </li>
                <li>
                  <span className="font-medium">Size:</span>{" "}
                  {product.size?.length} × {product.size?.width} ×{" "}
                  {product.size?.thickness}
                </li>
                <li>
                  <span className="font-medium">Origin:</span>{" "}
                  {product.origin || "N/A"}
                </li>
              </ul>

              {/* Description */}
              <p className="mt-3 text-gray-500 text-sm line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">
                ₹{product.pricePerUnit}
              </span>
              <span className="text-sm text-gray-500">/{product.unit}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListProducts;
