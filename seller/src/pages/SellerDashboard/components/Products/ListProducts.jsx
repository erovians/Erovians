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
    // <div className="space-y-6">
    //   {products.map((product) => (
    //     <div
    //       key={product._id}
    //       className="relative flex flex-col md:flex-row rounded-xl shadow-md hover:shadow-md transition-all duration-300 overflow-hidden"
    //     >
    //       {/* Status Button */}
    //       <div className="absolute top-2 right-2 z-10">
    //         <button
    //           onClick={async (e) => {
    //             e.preventDefault();
    //             try {
    //               const newStatus =
    //                 product.status === "active" ? "inactive" : "active";
    //               await api.patch(`/product/${product._id}/status`, {
    //                 status: newStatus,
    //               });

    //               // update state locally
    //               setProducts((prev) =>
    //                 prev.map((p) =>
    //                   p._id === product._id ? { ...p, status: newStatus } : p
    //                 )
    //               );
    //             } catch (err) {
    //               console.error("Failed to update status", err);
    //             }
    //           }}
    //           className={`px-3 py-1 text-sm rounded-full ${
    //             product.status === "active"
    //               ? "bg-green-100 text-green-700"
    //               : "bg-red-100 text-red-700"
    //           }`}
    //         >
    //           {product.status === "active" ? "Active" : "Inactive"}
    //         </button>
    //       </div>

    //       {/* Left: Product Images */}
    //       <div className="md:w-2/4 w-full h-[280px] relative flex items-center justify-center">
    //         {product.productImages && product.productImages.length > 0 ? (
    //           <Carousel className="w-full h-full">
    //             <CarouselContent>
    //               {product.productImages.map((img, idx) => (
    //                 <CarouselItem
    //                   key={idx}
    //                   className="flex items-center justify-center"
    //                 >
    //                   <img
    //                     src={img}
    //                     alt={`${product.productName} - ${idx + 1}`}
    //                     className="w-full h-[280px] object-contain"
    //                   />
    //                 </CarouselItem>
    //               ))}
    //             </CarouselContent>
    //             <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-white" />
    //             <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-white" />
    //           </Carousel>
    //         ) : (
    //           <div className="w-full h-full flex items-center justify-center text-gray-400">
    //             No Image
    //           </div>
    //         )}
    //       </div>

    //       {/* Right: Product Details */}
    //       <Link
    //         to={`/sellerdashboard/product/${product._id}`}
    //         className="md:w-full w-full p-6 flex flex-col justify-between"
    //       >
    //         <div>
    //           {/* Title */}
    //           <h3 className="text-xl font-semibold text-gray-800">
    //             {product.productName}
    //           </h3>

    //           {/* Highlights */}
    //           <ul className="mt-3 space-y-1 text-sm text-gray-600">
    //             <li>
    //               <span className="font-medium">Category:</span>{" "}
    //               {product.category}
    //             </li>
    //             <li>
    //               <span className="font-medium">Grade:</span> {product.grade}
    //             </li>
    //             <li>
    //               <span className="font-medium">Size:</span>{" "}
    //               {product.size?.length} × {product.size?.width} ×{" "}
    //               {product.size?.thickness}
    //             </li>
    //             <li>
    //               <span className="font-medium">Origin:</span>{" "}
    //               {product.origin || "N/A"}
    //             </li>
    //           </ul>

    //           {/* Description */}
    //           <p className="mt-3 text-gray-500 text-sm line-clamp-3">
    //             {product.description}
    //           </p>
    //         </div>

    //         {/* Price */}
    //         <div className="mt-4 flex items-baseline gap-2">
    //           <span className="text-2xl font-bold text-emerald-600">
    //             ₹{product.pricePerUnit}
    //           </span>
    //           <span className="text-sm text-gray-500">/{product.unit}</span>
    //         </div>
    //       </Link>
    //     </div>
    //   ))}
    // </div>
    <div className="space-y-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="relative flex flex-col md:flex-row rounded-xl shadow-md hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          {/* Status Toggle */}
          <div className="absolute top-3 right-3 z-16  flex justify-between gap-3">
            <button
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const newStatus =
                    product.status === "active" ? "inactive" : "active";
                  await api.patch(`/product/${product._id}/status`, {
                    status: newStatus,
                  });

                  // update state locally
                  setProducts((prev) =>
                    prev.map((p) =>
                      p._id === product._id ? { ...p, status: newStatus } : p
                    )
                  );
                } catch (err) {
                  console.error("Failed to update status", err);
                }
              }}
              className={`relative inline-flex items-center h-5 rounded-full w-12 transition-colors duration-300 focus:outline-none ${
                product.status === "active" ? "bg-green-500" : "bg-red-600"
              }`}
            >
              <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
                  product.status === "active"
                    ? "translate-x-8"
                    : "translate-x-0"
                }`}
              ></span>
            </button>
            <span className="ml-2 text-sm font-medium text-gray-700">
              {product.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Left: Product Images */}
          <div className="md:w-2/4 w-full h-[280px] relative flex items-center justify-center">
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
