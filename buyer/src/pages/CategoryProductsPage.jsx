import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import FilterPillsBar from "../components/filters/FilterPillsBar";
import AppliedFilters from "../components/filters/AppliedFilters";
import FilterBottomSheet from "../components/filters/FilterBottomSheet";
import SubCategoryFilter from "../components/filters/filters/SubCategoryFilter";
import GradeFilter from "../components/filters/filters/GradeFilter";
import ColorFilter from "../components/filters/filters/ColorFilter";
import OriginFilter from "../components/filters/filters/OriginFilter";
import PriceRangeFilter from "../components/filters/filters/PriceRangeFilter";
import SizeFilter from "../components/filters/filters/SizeFilter";
import WeightFilter from "../components/filters/filters/WeightFilter";
import SortByFilter from "../components/filters/filters/SortByFilter";
import NewArrivalsFilter from "../components/filters/filters/NewArrivalsFilter";
import ProductCard from "../components/cards/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryProducts,
  setCategoryFilters,
  clearCategoryFilters,
} from "../lib/redux/category/categorySlice";

const CategoryProductsPage = () => {
  const { categorySlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, categoryFilters, loading, error, pagination } = useSelector(
    (state) => state.category
  );

  const [tempFilters, setTempFilters] = useState(categoryFilters);
  const [activeBottomSheet, setActiveBottomSheet] = useState(null);

  // Initial fetch
  useEffect(() => {
    dispatch(
      fetchCategoryProducts({
        categorySlug,
        page: 1,
        limit: 10,
        filters: {},
      })
    );
  }, [categorySlug, dispatch]);

  // Re-fetch when filters change
  useEffect(() => {
    const apiFilters = {};

    // Map frontend filters to backend format
    if (categoryFilters.subCategory?.length > 0) {
      apiFilters.subCategory = categoryFilters.subCategory;
    }
    if (categoryFilters.grade?.length > 0) {
      apiFilters.grade = categoryFilters.grade;
    }
    if (categoryFilters.color?.length > 0) {
      apiFilters.color = categoryFilters.color;
    }
    if (categoryFilters.origin) {
      apiFilters.origin = categoryFilters.origin;
    }
    if (categoryFilters.priceMin) {
      apiFilters.priceMin = categoryFilters.priceMin;
    }
    if (categoryFilters.priceMax) {
      apiFilters.priceMax = categoryFilters.priceMax;
    }
    if (categoryFilters.lengthMin) {
      apiFilters.lengthMin = categoryFilters.lengthMin;
    }
    if (categoryFilters.lengthMax) {
      apiFilters.lengthMax = categoryFilters.lengthMax;
    }
    if (categoryFilters.widthMin) {
      apiFilters.widthMin = categoryFilters.widthMin;
    }
    if (categoryFilters.widthMax) {
      apiFilters.widthMax = categoryFilters.widthMax;
    }
    if (categoryFilters.thicknessMin) {
      apiFilters.thicknessMin = categoryFilters.thicknessMin;
    }
    if (categoryFilters.thicknessMax) {
      apiFilters.thicknessMax = categoryFilters.thicknessMax;
    }
    if (categoryFilters.weightMin) {
      apiFilters.weightMin = categoryFilters.weightMin;
    }
    if (categoryFilters.weightMax) {
      apiFilters.weightMax = categoryFilters.weightMax;
    }
    if (categoryFilters.sortBy) {
      apiFilters.sortBy = categoryFilters.sortBy;
    }
    if (categoryFilters.newArrivals) {
      apiFilters.newArrivals = true;
    }

    // Only fetch if filters are applied
    const hasFilters = Object.keys(apiFilters).length > 0;
    if (hasFilters) {
      dispatch(
        fetchCategoryProducts({
          categorySlug,
          page: 1,
          limit: 10,
          filters: apiFilters,
        })
      );
    }
  }, [categoryFilters, categorySlug, dispatch]);

  const handlePillClick = (filterId) => {
    setTempFilters(categoryFilters);
    setActiveBottomSheet(filterId);
  };

  const handleApplyFilter = () => {
    dispatch(setCategoryFilters(tempFilters));
    setActiveBottomSheet(null);
  };

  const handleRemoveFilter = (type, value) => {
    const updatedFilters = { ...categoryFilters };

    if (Array.isArray(updatedFilters[type])) {
      updatedFilters[type] = updatedFilters[type].filter((v) => v !== value);
    } else if (typeof updatedFilters[type] === "boolean") {
      updatedFilters[type] = false;
    } else {
      updatedFilters[type] = null;
    }

    dispatch(setCategoryFilters(updatedFilters));
  };

  const handleClearAll = () => {
    // Clear temp filters immediately
    setTempFilters({
      subCategory: [],
      grade: [],
      color: [],
      origin: "",
      priceMin: null,
      priceMax: null,
      lengthMin: null,
      lengthMax: null,
      widthMin: null,
      widthMax: null,
      thicknessMin: null,
      thicknessMax: null,
      weightMin: null,
      weightMax: null,
      sortBy: "",
      newArrivals: false,
    });

    // Clear Redux filters
    dispatch(clearCategoryFilters());

    // Re-fetch without filters
    dispatch(
      fetchCategoryProducts({
        categorySlug,
        page: 1,
        limit: 10,
        filters: {},
      })
    );
  };

  // Generic onChange handler
  const handleFilterChange = (key, value) => {
    setTempFilters({ ...tempFilters, [key]: value });
  };

  const renderFilterContent = () => {
    switch (activeBottomSheet) {
      case "sortBy":
        return (
          <SortByFilter
            selected={tempFilters.sortBy}
            onChange={(val) => handleFilterChange("sortBy", val)}
          />
        );
      case "subCategory":
        return (
          <SubCategoryFilter
            selected={tempFilters.subCategory || []}
            onChange={(val) => handleFilterChange("subCategory", val)}
          />
        );
      case "grade":
        return (
          <GradeFilter
            selected={tempFilters.grade || []}
            onChange={(val) => handleFilterChange("grade", val)}
          />
        );
      case "color":
        return (
          <ColorFilter
            selected={tempFilters.color || []}
            onChange={(val) => handleFilterChange("color", val)}
          />
        );
      case "origin":
        return (
          <OriginFilter
            origin={tempFilters.origin || ""}
            onChange={(val) => handleFilterChange("origin", val)}
          />
        );
      case "priceRange":
        return (
          <PriceRangeFilter
            priceMin={tempFilters.priceMin}
            priceMax={tempFilters.priceMax}
            onChange={handleFilterChange}
          />
        );
      case "size":
        return (
          <SizeFilter
            lengthMin={tempFilters.lengthMin}
            lengthMax={tempFilters.lengthMax}
            widthMin={tempFilters.widthMin}
            widthMax={tempFilters.widthMax}
            thicknessMin={tempFilters.thicknessMin}
            thicknessMax={tempFilters.thicknessMax}
            onChange={handleFilterChange}
          />
        );
      case "weight":
        return (
          <WeightFilter
            weightMin={tempFilters.weightMin}
            weightMax={tempFilters.weightMax}
            onChange={handleFilterChange}
          />
        );
      case "newArrivals":
        return (
          <NewArrivalsFilter
            checked={tempFilters.newArrivals || false}
            onChange={(val) => handleFilterChange("newArrivals", val)}
          />
        );
      default:
        return null;
    }
  };

  const getSheetTitle = () => {
    const titles = {
      sortBy: "Sort Products",
      subCategory: "Select Sub Category",
      grade: "Select Grade",
      color: "Select Color",
      origin: "Select Origin",
      priceRange: "Select Price Range",
      size: "Select Size Range",
      weight: "Select Weight",
      newArrivals: "New Arrivals",
    };
    return titles[activeBottomSheet] || "Filter";
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="flex w-full min-h-screen">
          <div className="hidden lg:block">
            <Sidebar type="product" />
          </div>

          <div className="flex-1 w-full">
            <FilterPillsBar
              type="product"
              activeFilters={categoryFilters}
              onPillClick={handlePillClick}
            />

            <AppliedFilters
              type="product"
              filters={categoryFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
            />

            <div className="px-4 sm:px-6 py-3 sm:py-2 mt-15 sm:mt-2">
              <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
                    {categorySlug?.replace(/-/g, " ")}
                  </h1>
                  {!loading && products.length > 0 && (
                    <p className="text-gray-600 mt-2">
                      {pagination.totalProducts} products found
                    </p>
                  )}
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500 text-lg">No products found</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Try adjusting your filters
                    </p>
                  </div>
                )}

                {/* Products Grid */}
                {!loading && !error && products.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onClick={(id) => navigate(`/product/${id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <FilterBottomSheet
          isOpen={activeBottomSheet !== null}
          onClose={() => setActiveBottomSheet(null)}
          title={getSheetTitle()}
          onApply={handleApplyFilter}
          onClearAll={handleClearAll}
        >
          {renderFilterContent()}
        </FilterBottomSheet>
      </div>
    </Layout>
  );
};

export default CategoryProductsPage;
