import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../../redux/slice/productSlice.js";
import { Link } from "react-router-dom";

const Categories = ({ companyId = "68e35cd9bb20aba94edb0598" }) => {
  const dispatch = useDispatch();
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    if (companyId) {
      dispatch(fetchProducts(companyId));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const filteredProducts = products.filter(
        (p) => p.status === "active" || p.status === "inactive"
      );

      const grouped = filteredProducts.reduce((acc, product) => {
        const category = product.category || "Uncategorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
      }, {});

      setGroupedProducts(grouped);
    }
  }, [products]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10 bg-gray-50">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
        Categories & Products
      </h1>

      {Object.entries(groupedProducts).map(([category, items]) => (
        <div key={category} className="mb-12">
          <div className="flex justify-between items-baseline border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl sm:text-2xl text-gray-900 tracking-tight">
              {category}
            </h2>
            <span className="text-sm font-semibold text-gray-500">
              {items.length} Product{items.length !== 1 ? "s" : ""}
            </span>
          </div>
 
          {/* Horizontal scrollable product carousel */}
          <div className="flex space-x-4 sm:space-x-6 overflow-x-aut o scrollbar-hide pb-4">
            {items.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all duration-300"
              >
                {/* Product Image */}
                <div className="h-40 sm:h-48 bg-gray-50 flex items-center justify-center overflow-hidden relative rounded-t-lg">   
                  {product.productImages?.length ? (
                    <img
                      src={product.productImages[0]}
                      alt={product.productName}
                      className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No Image</div>
                  )}

                  {/* Status Badge */}
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium rounded-full ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex flex-col  h-[300px] justify-between ">
                  <div>
                    <h3 className="text-sm sm:text-md font-semibold text-gray-800 line-clamp-2">
                      {product.productName}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-3">
                      {product.description || "No description available."}
                    </p>

                    <span className="text-[10px] sm:text-xs text-gray-500 mt-1 block">
                      <span className="text-black font-semibold">
                        SubCategory:{" "}
                      </span>
                      {product.subCategory}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.pricePerUnit}
                      </span>
                      <span className="text-xs text-gray-500">
                        /{product.priceUnit}
                      </span>
                    </div>

                    <Link
                      to={`/sellerdashboard/product/${product.id}`}
                      className="mt-2 block w-full text-center bg-gray-800 text-white text-sm py-2 rounded hover:bg-gray-900 transition"
                    >
                      View Details
                    </Link>
                  </div>

                  <p className="text-[10px] text-gray-400 text-right ">
                    Updated{" "}
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
