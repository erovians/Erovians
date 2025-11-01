import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

// --- Constants
const DEBOUNCE_DELAY = 500;
const BULK_ACTIONS = {
  ACTIVATE: "activate",
  DEACTIVATE: "deactivate",
  DELETE: "delete",
};

const STATUS_TYPES = {
  ALL: "all",
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  VIOLATION: "violation",
};

const ListProducts = () => {
  const dispatch = useDispatch();
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const { company } = useSelector((state) => state.company);

  const { categories, subCategories } = useMemo(() => {
    const main =
      company?.companyBasicInfo?.mainCategory
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];

    const sub =
      company?.companyBasicInfo?.subCategory
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];

    // Always include “All” at the top for universal filter UX
    const mappedCategories = [
      { label: "All Categories", value: "all" },
      ...main.map((c) => ({ label: c, value: c })),
    ];
    const mappedSubCategories = [
      { label: "All Subcategories", value: "all" },
      ...sub.map((s) => ({ label: s, value: s })),
    ];

    return { categories: mappedCategories, subCategories: mappedSubCategories };
  }, [company]);

  // Redux state
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  // Filter states
  const [category, setCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(STATUS_TYPES.ALL);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Bulk action states
  const [bulkAction, setBulkAction] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    violation: 0,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (isMountedRef.current) {
        setDebouncedSearch(search);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch products on mount
  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(fetchProducts());
    }
    console.log("Categories:", categories);
    console.log("SubCategories:", subCategories);
  }, [dispatch]);

  // Calculate filtered products and status counts
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Calculate status counts
    const counts = {
      all: filtered.filter(
        (p) =>
          p.status === STATUS_TYPES.ACTIVE || p.status === STATUS_TYPES.INACTIVE
      ).length,
      active: filtered.filter((p) => p.status === STATUS_TYPES.ACTIVE).length,
      inactive: filtered.filter((p) => p.status === STATUS_TYPES.INACTIVE)
        .length,
      pending: filtered.filter((p) => p.status === STATUS_TYPES.PENDING).length,
      violation: filtered.filter((p) => p.status === STATUS_TYPES.VIOLATION)
        .length,
    };

    // Update counts only if they changed
    if (JSON.stringify(counts) !== JSON.stringify(statusCounts)) {
      setStatusCounts(counts);
    }

    // Filter by bulk action requirements
    if (bulkAction === BULK_ACTIONS.ACTIVATE) {
      filtered = filtered.filter((p) => p.status !== STATUS_TYPES.ACTIVE);
    } else if (bulkAction === BULK_ACTIONS.DEACTIVATE) {
      filtered = filtered.filter((p) => p.status === STATUS_TYPES.ACTIVE);
    }

    // Filter by status
    if (!bulkAction) {
      if (statusFilter === STATUS_TYPES.ALL) {
        filtered = filtered.filter(
          (p) =>
            p.status === STATUS_TYPES.ACTIVE ||
            p.status === STATUS_TYPES.INACTIVE
        );
      } else {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filter by subcategory
    if (subCategory !== "all") {
      filtered = filtered.filter((p) => p.subCategory === subCategory);
    }

    // Filter by search
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(searchLower)
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
    statusCounts,
  ]);

  // Clear selections when bulk action changes
  useEffect(() => {
    setSelectedProducts([]);
  }, [bulkAction]);

  // Centralized error handler
  const handleApiError = useCallback(
    (err, fallbackMessage = "Operation failed") => {
      console.error("API Error:", err);
      const message =
        err?.response?.data?.message || err.message || fallbackMessage;
      toast.error(message);
    },
    []
  );

  // Handle bulk actions with proper error handling and loading states
  const handleBulkAction = useCallback(async () => {
    if (selectedProducts.length === 0) {
      toast.warning("Please select at least one product");
      return;
    }

    if (isBulkProcessing) return; // Prevent double submission

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const actionMessages = {
      [BULK_ACTIONS.ACTIVATE]: {
        loading: `Activating ${selectedProducts.length} product(s)...`,
        success: `Successfully activated ${selectedProducts.length} product(s)`,
        error: "Failed to activate products",
      },
      [BULK_ACTIONS.DEACTIVATE]: {
        loading: `Deactivating ${selectedProducts.length} product(s)...`,
        success: `Successfully deactivated ${selectedProducts.length} product(s)`,
        error: "Failed to deactivate products",
      },
      [BULK_ACTIONS.DELETE]: {
        loading: `Deleting ${selectedProducts.length} product(s)...`,
        success: `Successfully deleted ${selectedProducts.length} product(s)`,
        error: "Failed to delete products",
      },
    };

    const messages = actionMessages[bulkAction];
    if (!messages) {
      toast.error("Invalid bulk action");
      return;
    }

    try {
      setIsBulkProcessing(true);
      toast.loading(messages.loading);

      const endpoint = `/product/bulk-${bulkAction}`;
      await api.post(endpoint, { productIds: selectedProducts }, { signal });

      if (!isMountedRef.current) return;

      toast.dismiss();
      toast.success(messages.success);

      // Reset state
      setBulkAction("");
      setSelectedProducts([]);

      // Refresh products list
      dispatch(fetchProducts());
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        return; // Request was cancelled, don't show error
      }

      if (!isMountedRef.current) return;

      toast.dismiss();
      handleApiError(err, messages.error);
    } finally {
      if (isMountedRef.current) {
        setIsBulkProcessing(false);
        abortControllerRef.current = null;
      }
    }
  }, [
    selectedProducts,
    bulkAction,
    isBulkProcessing,
    dispatch,
    handleApiError,
  ]);

  // Handle bulk action cancellation
  const handleCancelBulkAction = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setBulkAction("");
    setSelectedProducts([]);
    setIsBulkProcessing(false);
  }, []);

  // Handle checkbox toggle
  const handleProductSelection = useCallback((productId, isChecked) => {
    setSelectedProducts((prev) => {
      if (isChecked) {
        return [...prev, productId];
      }
      return prev.filter((id) => id !== productId);
    });
  }, []);

  // Handle mobile dropdown change
  const handleMobileFilterChange = useCallback((value) => {
    if (value.startsWith("category:")) {
      setCategory(value.split(":")[1]);
    } else if (value.startsWith("subcategory:")) {
      setSubCategory(value.split(":")[1]);
    } else if (value.startsWith("status:")) {
      setStatusFilter(value.split(":")[1]);
    } else if (Object.values(BULK_ACTIONS).includes(value)) {
      setBulkAction(value);
    }
  }, []);

  // Format date safely
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (err) {
      console.error("Date formatting error:", err);
      return "N/A";
    }
  }, []);

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-150px)]">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-150px)]">
      {/* Filters */}
      <div className="static z-30 sm:bg-white sm:shadow-sm rounded-lg md:p-4">
        {/* Large screen view */}
        <div className="hidden sm:flex flex-col gap-4">
          {/* Filters and Search */}
          <div className="flex flex-wrap justify-between gap-4 items-center">
            <div className="flex gap-5 flex-wrap">
              <Filter
                label="Categories"
                value={category}
                onChange={setCategory}
                options={categories}
                loading={loading}
              />
              <Filter
                label="SubCategory"
                value={subCategory}
                onChange={setSubCategory}
                options={subCategories}
                loading={loading}
              />
            </div>
            <div className="w-auto">
              <Search
                value={search}
                onChange={setSearch}
                placeholder="Search product..."
              />
            </div>
          </div>

          {/* Status Filter & Bulk Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <StatusFilterRibbon
              statusCounts={statusCounts}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBulkAction(BULK_ACTIONS.ACTIVATE)}
                disabled={isBulkProcessing}
                className="px-3 py-2 border rounded hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Activate
              </button>
              <button
                onClick={() => setBulkAction(BULK_ACTIONS.DEACTIVATE)}
                disabled={isBulkProcessing}
                className="px-3 py-2 border rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deactivate
              </button>
              <button
                onClick={() => setBulkAction(BULK_ACTIONS.DELETE)}
                disabled={isBulkProcessing}
                className="px-3 py-2 border rounded hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>

            {/* Bulk Action Confirm / Cancel buttons */}
            {bulkAction && (
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={handleCancelBulkAction}
                  disabled={isBulkProcessing}
                  className="px-3 py-2 bg-gray-300 text-black rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                {selectedProducts.length > 0 ? (
                  <button
                    onClick={handleBulkAction}
                    disabled={isBulkProcessing}
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isBulkProcessing && <Spinner className="w-4 h-4" />}
                    {isBulkProcessing
                      ? `Processing...`
                      : `Confirm ${bulkAction} (${selectedProducts.length})`}
                  </button>
                ) : (
                  <span className="px-3 py-2 text-gray-500 rounded border">
                    Select products to {bulkAction}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Small screen view: Only Dropdown */}
        <div className="sm:hidden mt-2">
          <select
            className="w-full rounded h-10"
            onChange={(e) => handleMobileFilterChange(e.target.value)}
            value={bulkAction || ""}
            disabled={loading || isBulkProcessing}
          >
            <option value="">-- Select Action --</option>

            <option disabled>-- Categories --</option>
            <option value="category:all">All Categories</option>
            <option value="category:Marble">Marble</option>
            <option value="category:Granite">Granite</option>

            <option disabled>-- Subcategories --</option>
            <option value="subcategory:all">All Subcategories</option>
            <option value="subcategory:Polished">Polished</option>
            <option value="subcategory:Honed">Honed</option>
            <option value="subcategory:Natural">Natural</option>

            <option disabled>-- Status --</option>
            {Object.entries(statusCounts).map(([status, count]) => (
              <option key={status} value={`status:${status}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </option>
            ))}

            <option disabled>-- Bulk Actions --</option>
            <option value={BULK_ACTIONS.ACTIVATE}>Activate Multiple</option>
            <option value={BULK_ACTIONS.DEACTIVATE}>Deactivate Multiple</option>
            <option value={BULK_ACTIONS.DELETE}>Delete Multiple</option>
          </select>

          {/* Mobile bulk action controls */}
          {bulkAction && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCancelBulkAction}
                disabled={isBulkProcessing}
                className="flex-1 px-3 py-2 bg-gray-300 text-black rounded text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              {selectedProducts.length > 0 && (
                <button
                  onClick={handleBulkAction}
                  disabled={isBulkProcessing}
                  className="flex-1 px-3 py-2 bg-gray-500 text-white rounded text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isBulkProcessing && <Spinner className="w-4 h-4" />}
                  {isBulkProcessing
                    ? "Processing..."
                    : `Confirm (${selectedProducts.length})`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Spinner className="w-12 h-12 mx-auto mb-4" />
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-xl text-gray-500">
              No products found
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              bulkAction={bulkAction}
              isSelected={selectedProducts.includes(product.id || product._id)}
              onSelectionChange={handleProductSelection}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Separate ProductCard component for better performance
const ProductCard = React.memo(
  ({ product, bulkAction, isSelected, onSelectionChange, formatDate }) => {
    const productId = product.id || product._id;

    const handleCheckboxChange = useCallback(
      (e) => {
        onSelectionChange(productId, e.target.checked);
      },
      [productId, onSelectionChange]
    );

    const getStatusClasses = useCallback((status) => {
      const statusMap = {
        active: "bg-green-100 text-green-700 border border-green-300",
        inactive: "bg-red-100 text-red-700 border border-red-300",
        pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
        violation: "bg-purple-100 text-purple-700 border border-purple-300",
      };
      return (
        statusMap[status] || "bg-gray-100 text-gray-700 border border-gray-300"
      );
    }, []);

    return (
      <div className="relative flex flex-col md:flex-row rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-white justify-center items-center gap-1">
        {/* Status + Views Section */}
        <div className="absolute top-3 right-3 items-center justify-center gap-3 z-10 hidden md:flex">
          {/* Views Count */}
          <span className="flex items-center gap-1 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            👁️ {product.views || 0} views
          </span>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
              product.status
            )}`}
          >
            {product.status}
          </span>

          {/* Checkbox for bulk actions */}
          {bulkAction && (
            <input
              type="checkbox"
              className="h-6 w-6 cursor-pointer"
              checked={isSelected}
              onChange={handleCheckboxChange}
              aria-label={`Select ${product.productName}`}
            />
          )}
        </div>

        {/* Images */}
        <div className="md:w-1/3 w-full  h-48 md:h-auto flex flex-col justify-end items-end relative">
          {product.productImages?.length > 0 ? (
            <Carousel className="w-full h-full">
              <CarouselContent>
                {product.productImages.map((img, idx) => (
                  <CarouselItem
                    key={idx}
                    className="flex items-center justify-center"
                  >
                    <div className="w-full md:w-[90%] border overflow-hidden rounded-lg">
                      <img
                        src={img}
                        alt={`${product.productName} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
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

          {/* Views + Status + Checkbox for small screens */}
          <div className="mt-1 flex gap-2 items-center text-xs md:hidden self-end">
            <span className="text-gray-600 font-medium px-2 py-1 rounded">
              👁️ {product.views || 0} views
            </span>

            <span
              className={`px-3 py-1 mr-4 rounded-full text-xs font-medium ${getStatusClasses(
                product.status
              )}`}
            >
              {product.status}
            </span>

            {bulkAction && (
              <input
                type="checkbox"
                className="h-5 w-5 cursor-pointer"
                checked={isSelected}
                onChange={handleCheckboxChange}
                aria-label={`Select ${product.productName}`}
              />
            )}
          </div>
        </div>

        {/* Details */}
        <Link
          to={`/sellerdashboard/product/${productId}`}
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
                <span className="font-medium">Grade:</span> {product.grade}
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
            <span className="text-sm text-gray-500">/{product.priceUnit}</span>
          </div>
        </Link>

        {/* Last Updated Timestamp */}
        <div className="absolute bottom-2 right-4 text-xs text-gray-400">
          Last updated: {formatDate(product.updatedAt)}
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ListProducts;
