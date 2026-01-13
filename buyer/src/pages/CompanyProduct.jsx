import { useState } from "react";
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
import productsData from "../assets/fakeData/productData";

const CompanyProduct = () => {
  const { productId } = useParams();
  const [activeBottomSheet, setActiveBottomSheet] = useState(null);
  const navigate = useNavigate();

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

  const handlePillClick = (filterId) => {
    setTempFilters(filters);
    setActiveBottomSheet(filterId);
  };

  const handleApplyFilter = () => {
    setFilters(tempFilters);
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
    setFilters({
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
        <div className="flex w-full">
          <div className="hidden lg:block">
            <Sidebar type="product" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                  {productsData.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onClick={(id) => navigate(`/product/${id}`)}
                    />
                  ))}
                </div>
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
