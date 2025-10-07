import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../../redux/slice/productSlice";
import api from "@/utils/axios.utils";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Filter } from "../Helper/Filter";
import { Search } from "../Helper/Search";
import StatusFilterRibbon from "../Helper/StatusFilterRibbon";

const ListProducts = ({ companyId = "68e35cd9bb20aba94edb0598" }) => {
  const dispatch = useDispatch();

  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const [category, setCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    violation: 0,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [bulkAction, setBulkAction] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch products via Redux thunk
  useEffect(() => {
    if (companyId) {
      dispatch(fetchProducts(companyId));
    }
  }, [companyId, dispatch]);

  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    const counts = {
      all: filtered.filter(
        (p) => p.status === "active" || p.status === "inactive"
      ).length,
      active: filtered.filter((p) => p.status === "active").length,
      inactive: filtered.filter((p) => p.status === "inactive").length,
      pending: filtered.filter((p) => p.status === "pending").length,
      violation: filtered.filter((p) => p.status === "violation").length,
    };
    setStatusCounts(counts);

    if (bulkAction === "activate") {
      filtered = filtered.filter((p) => p.status !== "active");
    } else if (bulkAction === "deactivate") {
      filtered = filtered.filter((p) => p.status === "active");
    }

    if (!bulkAction) {
      if (statusFilter === "all") {
        filtered = filtered.filter(
          (p) => p.status === "active" || p.status === "inactive"
        );
      } else {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }
    }

    if (category !== "all")
      filtered = filtered.filter((p) => p.category === category);
    if (subCategory !== "all")
      filtered = filtered.filter((p) => p.subCategory === subCategory);

    if (debouncedSearch) {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    return filtered;
  }, [
    products,
    category,
    subCategory,
    debouncedSearch,
    statusFilter,
    bulkAction,
  ]);

  useEffect(() => {
    setSelectedProducts([]);
  }, [bulkAction]);

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (selectedProducts.length === 0) {
      alert("Select at least one product!");
      return;
    }

    try {
      if (bulkAction === "activate") {
        await api.post("/product/bulk-activate", {
          productIds: selectedProducts,
        });
      } else if (bulkAction === "deactivate") {
        await api.post("/product/bulk-deactivate", {
          productIds: selectedProducts,
        });
      } else if (bulkAction === "delete") {
        await api.post("/product/bulk-delete", {
          productIds: selectedProducts,
        });
      }

      setBulkAction("");
      setSelectedProducts([]);
      dispatch(fetchProducts(companyId)); // Refresh after bulk action
    } catch (err) {
      console.error(err);
      alert("Bulk action failed!");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white shadow-sm rounded-lg">
        <div className="flex flex-wrap justify-between gap-4 items-center p-4">
          <div className="flex gap-5 flex-wrap">
            <Filter
              label="Categories"
              value={category}
              onChange={setCategory}
              options={[
                { label: "All Categories", value: "all" },
                { label: "Marble", value: "Marble" },
                { label: "Granite", value: "Granite" },
              ]}
              loading={loading}
            />
            <Filter
              label="SubCategory"
              value={subCategory}
              onChange={setSubCategory}
              options={[
                { label: "All Subcategories", value: "all" },
                { label: "Polished", value: "Polished" },
                { label: "Honed", value: "Honed" },
                { label: "Natural", value: "Natural" },
              ]}
              loading={loading}
            />
          </div>
          <Search
            value={search}
            onChange={setSearch}
            placeholder="Search product..."
          />
        </div>

        <div className="flex flex-wrap items-center  p-4">
          {/* Status Filter Ribbon */}
          <StatusFilterRibbon
            statusCounts={statusCounts}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* Bulk Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setBulkAction("activate")}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border hover:bg-green-100 transition-all duration-200"
            >
              Activate Multiple
            </button>
            <button
              onClick={() => setBulkAction("deactivate")}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border hover:bg-red-100 transition-all duration-200"
            >
              Deactivate Multiple
            </button>
            <button
              onClick={() => setBulkAction("delete")}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border hover:bg-purple-100 transition-all duration-200"
            >
              Delete Multiple
            </button>

            {bulkAction && (
              <>
                <button
                  onClick={() => {
                    setBulkAction("");
                    setSelectedProducts([]);
                  }}
                  className="px-3 py-2 bg-gray-300 text-black rounded"
                >
                  Cancel
                </button>

                {selectedProducts.length > 0 && (
                  <button
                    onClick={handleBulkAction}
                    className="px-3 py-2 bg-gray-500 text-white rounded"
                  >
                    Confirm {bulkAction} ({selectedProducts.length})
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-xl text-gray-500 mt-10">
            No products found
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="relative flex flex-col md:flex-row rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-white items-center"
            >
              {bulkAction && (
                <input
                  type="checkbox"
                  className="m-4 h-5 w-5"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts([...selectedProducts, product.id]);
                    } else {
                      setSelectedProducts(
                        selectedProducts.filter((id) => id !== product.id)
                      );
                    }
                  }}
                />
              )}

              {/* <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : product.status === "inactive"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : product.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : "bg-purple-100 text-purple-700 border border-purple-300"
                  }`}
                >
                  {product.status === "active"
                    ? "Active"
                    : product.status === "inactive"
                    ? "Inactive"
                    : product.status === "pending"
                    ? "Pending"
                    : "Violation"}
                </span>
              </div> */}
              {/* 🔹 Status + Views Section */}
              <div className="absolute top-3 right-3 flex items-center gap-3 z-10">
                {/* 👁️ Views Count */}
                <span className="flex items-center gap-1  text-gray-600 text-xs font-medium  px-2 py-1 rounded-full ">
                  👁️ {product.views || 0} views
                </span>
                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : product.status === "inactive"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : product.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : "bg-purple-100 text-purple-700 border border-purple-300"
                  }`}
                >
                  {product.status}
                </span>
              </div>

              {/* Images */}
              <div className="md:w-1/3 w-full h-48 md:h-auto flex items-center justify-center bg-gray-50">
                {product.productImages?.length > 0 ? (
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {product.productImages.map((img, idx) => (
                        <CarouselItem
                          key={idx}
                          className="flex items-center justify-center"
                        >
                          <img
                            src={img}
                            alt={`${product.productName} ${idx + 1}`}
                            className="w-full h-48 md:h-56 object-contain"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow hover:bg-white" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow hover:bg-white" />
                  </Carousel>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <Link
                to={`/sellerdashboard/product/${product.id}`}
                className="md:w-2/3 w-full p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    {product.productName}
                  </h3>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>
                      <span className="font-medium">Category:</span>{" "}
                      {product.category}
                    </li>
                    <li>
                      <span className="font-medium">Sub Category:</span>{" "}
                      {product.subCategory}
                    </li>
                    <li>
                      <span className="font-medium">Grade:</span>{" "}
                      {product.grade}
                    </li>
                    <li>
                      <span className="font-medium">Size:</span>{" "}
                      {product.size?.length || "N/A"}
                      {product.size?.lengthMeasurement || ""} ×{" "}
                      {product.size?.width || "N/A"}
                      {product.size?.widthMeasurement || ""} ×{" "}
                      {product.size?.thickness || "N/A"}
                      {product.size?.thicknessMeasurement || ""}
                    </li>
                    <li>
                      <span className="font-medium">Origin:</span>{" "}
                      {product.origin || "N/A"}
                    </li>
                  </ul>
                  <p className="mt-2 text-gray-500 text-sm line-clamp-3">
                    {product.description}
                  </p>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-bold text-black">
                    ₹{product.pricePerUnit}
                  </span>
                  <span className="text-sm text-gray-500">
                    /{product.priceUnit}
                  </span>
                </div>
              </Link>
              {/* 🔹 Last Updated Timestamp */}
              <div className="absolute bottom-2 right-4 text-xs text-gray-400">
                Last updated:{" "}
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListProducts;
