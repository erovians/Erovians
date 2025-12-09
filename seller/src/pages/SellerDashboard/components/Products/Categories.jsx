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
      const filtered = products.filter(
        (p) => p.status === "active" || p.status === "inactive"
      );

      const grouped = filtered.reduce((acc, product) => {
        const category = product.category || "Uncategorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
      }, {});

      setGroupedProducts(grouped);
    }
  }, [products]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10 bg-gray-50">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-900 mb-10">
        Categories & Products
      </h1>

      {Object.entries(groupedProducts).map(([category, items]) => (
        <div key={category} className="mb-14">
          {/* Category Header */}
          <div className="flex justify-between items-baseline border-b pb-3 mb-6">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
              {category}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              {items.length} Product{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* MOBILE GRID (XS/SM) */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:hidden gap-4">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-lg shadow hover:shadow-lg transition p-3"
              >
                {/* Image */}
                <div className="h-36 bg-gray-50 rounded-lg overflow-hidden flex justify-center items-center">
                  <img
                    src={product.productImages?.[0]}
                    alt={product.productName}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <h3 className="text-sm font-semibold text-gray-800 mt-3 line-clamp-2">
                  {product.productName}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                  {product.description}
                </p>

                <p className="text-[11px] text-gray-500 mt-1">
                  <span className="font-medium text-black">SubCategory: </span>
                  {product.subCategory}
                </p>

                <div className="flex items-center gap-1 mt-3">
                  <p className="text-lg font-bold">₹{product.pricePerUnit}</p>
                  <p className="text-xs text-gray-600">/{product.priceUnit}</p>
                </div>

                <Link
                  to={`/sellerdashboard/product/${product.id}`}
                  className="mt-3 block w-full text-center text-sm py-2 rounded bg-gray-800 text-white"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {/* DESKTOP/TABLET HORIZONTAL SCROLL */}
          <div className="hidden sm:flex space-x-5 overflow-x-auto pb-3 scrollbar-hide">
            {items.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-56 md:w-64 lg:w-72 bg-white border rounded-lg shadow hover:shadow-xl transition"
              >
                {/* Image */}
                <div className="h-44 bg-gray-50 rounded-t-lg overflow-hidden flex items-center justify-center relative">
                  <img
                    src={product.productImages?.[0]}
                    alt={product.productName}
                    className="w-full h-full object-contain"
                  />

                  {/* Status Badge */}
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-full ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between h-[280px]">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 line-clamp-2">
                      {product.productName}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                      {product.description}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-semibold text-black">
                        SubCategory:
                      </span>{" "}
                      {product.subCategory}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-1">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{product.pricePerUnit}
                      </p>
                      <p className="text-xs text-gray-500">
                        /{product.priceUnit}
                      </p>
                    </div>

                    <Link
                      to={`/sellerdashboard/product/${product.id}`}
                      className="mt-2 block w-full py-2 text-center text-sm bg-gray-800 text-white rounded hover:bg-gray-900"
                    >
                      View Details
                    </Link>
                  </div>

                  <p className="text-[10px] text-gray-400 text-right mt-2">
                    Updated{" "}
                    {new Date(product.updatedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
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
