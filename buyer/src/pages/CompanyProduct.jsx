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
import SizeFilter from "../components/filters/filters/SizeFilter";
import WeightFilter from "../components/filters/filters/WeightFilter";
import PriceUnitFilter from "../components/filters/filters/PriceUnitFilter";
import NewArrivalsFilter from "../components/filters/filters/NewArrivalsFilter";
import ProductCard from "../components/cards/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompaniesProduct } from "../lib/redux/company/companySlice";

const CompanyProduct = () => {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector((state) => state.company);

  const [filters, setFilters] = useState({
    mainCategory: [],
    subCategory: [],
    grade: [],
    color: [],
    length: [0, 300],
    width: [0, 300],
    thickness: [0, 10],
    weightRange: [0, 1000],
    weightUnit: "kg",
    priceUnit: [],
    newArrivals: false,
  });

  const [tempFilters, setTempFilters] = useState(filters);
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
    if (filters.mainCategory.length > 0) {
      apiFilters.category = filters.mainCategory;
    }
    if (filters.subCategory.length > 0) {
      apiFilters.subCategory = filters.subCategory;
    }
    if (filters.grade.length > 0) {
      apiFilters.grade = filters.grade;
    }
    if (filters.color.length > 0) {
      apiFilters.color = filters.color[0]; // Send first color only
    }
    if (filters.newArrivals) {
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
  }, [filters, companyId, dispatch]);

  const handlePillClick = (filterId) => {
    setTempFilters(filters);
    setActiveBottomSheet(filterId);
  };

  const handleApplyFilter = () => {
    setFilters(tempFilters);
    setActiveBottomSheet(null);
  };

  const handleRemoveFilter = (type, value) => {
    setFilters((prev) => {
      if (Array.isArray(prev[type])) {
        return { ...prev, [type]: prev[type].filter((v) => v !== value) };
      } else if (typeof prev[type] === "boolean") {
        return { ...prev, [type]: false };
      }
      return { ...prev, [type]: "" };
    });
  };

  const handleClearAll = () => {
    const clearedFilters = {
      mainCategory: [],
      subCategory: [],
      grade: [],
      color: [],
      length: [0, 300],
      width: [0, 300],
      thickness: [0, 10],
      weightRange: [0, 1000],
      weightUnit: "kg",
      priceUnit: [],
      newArrivals: false,
    };
    setFilters(clearedFilters);

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

  const handleSizeChange = (type, value) => {
    setTempFilters({ ...tempFilters, [type]: value });
  };

  const handleWeightChange = (type, value) => {
    if (type === "unit") {
      setTempFilters({ ...tempFilters, weightUnit: value });
    } else if (type === "range") {
      setTempFilters({ ...tempFilters, weightRange: value });
    }
  };

  const renderFilterContent = () => {
    switch (activeBottomSheet) {
      case "category":
        return (
          <CategoryFilter
            selected={tempFilters.mainCategory}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, mainCategory: val })
            }
          />
        );
      case "subCategory":
        return (
          <SubCategoryFilter
            selected={tempFilters.subCategory}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, subCategory: val })
            }
          />
        );
      case "grade":
        return (
          <GradeFilter
            selected={tempFilters.grade}
            onChange={(val) => setTempFilters({ ...tempFilters, grade: val })}
          />
        );
      case "color":
        return (
          <ColorFilter
            selected={tempFilters.color}
            onChange={(val) => setTempFilters({ ...tempFilters, color: val })}
          />
        );
      case "size":
        return (
          <SizeFilter
            length={tempFilters.length}
            width={tempFilters.width}
            thickness={tempFilters.thickness}
            onChange={handleSizeChange}
          />
        );
      case "weight":
        return (
          <WeightFilter
            weightRange={tempFilters.weightRange}
            weightUnit={tempFilters.weightUnit}
            onChange={handleWeightChange}
          />
        );
      case "priceUnit":
        return (
          <PriceUnitFilter
            selected={tempFilters.priceUnit}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, priceUnit: val })
            }
          />
        );
      case "newArrivals":
        return (
          <NewArrivalsFilter
            checked={tempFilters.newArrivals}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, newArrivals: val })
            }
          />
        );
      default:
        return null;
    }
  };

  const getSheetTitle = () => {
    const titles = {
      category: "Select Category",
      subCategory: "Select Sub Category",
      grade: "Select Grade",
      color: "Select Color",
      size: "Select Size Range",
      weight: "Select Weight",
      priceUnit: "Select Price Unit",
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
              activeFilters={filters}
              onPillClick={handlePillClick}
            />

            <AppliedFilters
              type="product"
              filters={filters}
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

        <FilterBottomSheet
          isOpen={activeBottomSheet !== null}
          onClose={() => setActiveBottomSheet(null)}
          title={getSheetTitle()}
          onApply={handleApplyFilter}
        >
          {renderFilterContent()}
        </FilterBottomSheet>
      </div>
    </Layout>
  );
};

export default CompanyProduct;
