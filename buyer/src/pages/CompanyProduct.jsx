import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import FilterPillsBar from "../components/filters/FilterPillsBar";
import AppliedFilters from "../components/filters/AppliedFilters";
import FilterBottomSheet from "../components/filters/FilterBottomSheet";
import CategoryFilter from "../components/filters/filters/CategoryFilter";
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
  fetchCompaniesProduct,
  setProductFilters,
  clearProductFilters,
} from "../lib/redux/company/companySlice";

const CompanyProduct = () => {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, productFilters, loading, error, pagination } = useSelector(
    (state) => state.company
  );

  const [tempFilters, setTempFilters] = useState(productFilters);
  const [activeBottomSheet, setActiveBottomSheet] = useState(null);

  // Initial fetch
  useEffect(() => {
    dispatch(
      fetchCompaniesProduct({
        companyId,
        page: 1,
        limit: 10,
        filters: {},
      })
    );
  }, [companyId, dispatch]);

  // Re-fetch when filters change
  useEffect(() => {
    const apiFilters = {};

    // Map frontend filters to backend format
    if (productFilters.category?.length > 0) {
      apiFilters.category = productFilters.category;
    }
    if (productFilters.subCategory?.length > 0) {
      apiFilters.subCategory = productFilters.subCategory;
    }
    if (productFilters.grade?.length > 0) {
      apiFilters.grade = productFilters.grade;
    }
    if (productFilters.color?.length > 0) {
      apiFilters.color = productFilters.color;
    }
    if (productFilters.origin) {
      apiFilters.origin = productFilters.origin;
    }
    if (productFilters.priceMin) {
      apiFilters.priceMin = productFilters.priceMin;
    }
    if (productFilters.priceMax) {
      apiFilters.priceMax = productFilters.priceMax;
    }
    if (productFilters.lengthMin) {
      apiFilters.lengthMin = productFilters.lengthMin;
    }
    if (productFilters.lengthMax) {
      apiFilters.lengthMax = productFilters.lengthMax;
    }
    if (productFilters.widthMin) {
      apiFilters.widthMin = productFilters.widthMin;
    }
    if (productFilters.widthMax) {
      apiFilters.widthMax = productFilters.widthMax;
    }
    if (productFilters.thicknessMin) {
      apiFilters.thicknessMin = productFilters.thicknessMin;
    }
    if (productFilters.thicknessMax) {
      apiFilters.thicknessMax = productFilters.thicknessMax;
    }
    if (productFilters.weightMin) {
      apiFilters.weightMin = productFilters.weightMin;
    }
    if (productFilters.weightMax) {
      apiFilters.weightMax = productFilters.weightMax;
    }
    if (productFilters.sortBy) {
      apiFilters.sortBy = productFilters.sortBy;
    }
    if (productFilters.newArrivals) {
      apiFilters.newArrivals = true;
    }

    // Only fetch if filters are applied
    const hasFilters = Object.keys(apiFilters).length > 0;
    if (hasFilters) {
      dispatch(
        fetchCompaniesProduct({
          companyId,
          page: 1,
          limit: 10,
          filters: apiFilters,
        })
      );
    }
  }, [productFilters, companyId, dispatch]);

  const handlePillClick = (filterId) => {
    setTempFilters(productFilters);
    setActiveBottomSheet(filterId);
  };

  const handleApplyFilter = () => {
    dispatch(setProductFilters(tempFilters));
    setActiveBottomSheet(null);
  };

  const handleRemoveFilter = (type, value) => {
    const updatedFilters = { ...productFilters };

    if (Array.isArray(updatedFilters[type])) {
      updatedFilters[type] = updatedFilters[type].filter((v) => v !== value);
    } else if (typeof updatedFilters[type] === "boolean") {
      updatedFilters[type] = false;
    } else {
      updatedFilters[type] = null;
    }

    dispatch(setProductFilters(updatedFilters));
  };

  // ✅ UPDATED - Global Clear All Function
  const handleClearAll = () => {
    // Clear temp filters immediately
    setTempFilters({
      category: [],
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
    dispatch(clearProductFilters());

    // Re-fetch without filters
    dispatch(
      fetchCompaniesProduct({
        companyId,
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
      case "category":
        return (
          <CategoryFilter
            selected={tempFilters.category || []}
            onChange={(val) => handleFilterChange("category", val)}
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
      category: "Select Category",
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
          <div className="hidden lg:block ">
            <Sidebar type="product" companyId={companyId} />
          </div>

          <div className="flex-1 w-full">
            <FilterPillsBar
              type="product"
              activeFilters={productFilters}
              onPillClick={handlePillClick}
            />

            <AppliedFilters
              type="product"
              filters={productFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
            />

            <div className="px-4 sm:px-6 py-3 sm:py-2 mt-15 sm:mt-2">
              <div className="max-w-7xl mx-auto">
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

        {/* ✅ UPDATED - Pass onClearAll prop */}
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

export default CompanyProduct;
