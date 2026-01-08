import { useState } from "react";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import FilterPillsBar from "../components/filters/FilterPillsBar";
import AppliedFilters from "../components/filters/AppliedFilters";
import FilterBottomSheet from "../components/filters/FilterBottomSheet";
import CategoryFilter from "../components/filters/filters/CategoryFilter";
import LocationFilter from "../components/filters/filters/LocationFilter";
import YearFilter from "../components/filters/filters/YearFilter";
import PaymentFilter from "../components/filters/filters/PaymentFilter";
import CurrencyFilter from "../components/filters/filters/CurrencyFilter";
import LanguageFilter from "../components/filters/filters/LanguageFilter";
import CompanyCard from "../components/cards/CompanyCard";
import Banner from "../components/common/Banner"; // 👈 ADD THIS IMPORT
import companiesData from "../assets/fakeData/companyData";
import sellersData from "../assets/fakeData/sellerData";
import { useNavigate } from "react-router-dom";

const Companies = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeBottomSheet, setActiveBottomSheet] = useState(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    mainCategory: [],
    country: "",
    state: "",
    city: "",
    yearRange: [1990, 2025],
    paymentMethods: [],
    currency: [],
    language: [],
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
      }
      return { ...prev, [type]: "" };
    });
  };

  const handleClearAll = () => {
    setFilters({
      mainCategory: [],
      country: "",
      state: "",
      city: "",
      yearRange: [1990, 2025],
      paymentMethods: [],
      currency: [],
      language: [],
    });
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
      case "location":
        return (
          <LocationFilter
            filters={tempFilters}
            onChange={(val) => setTempFilters(val)}
          />
        );
      case "year":
        return (
          <YearFilter
            yearRange={tempFilters.yearRange}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, yearRange: val })
            }
          />
        );
      case "payment":
        return (
          <PaymentFilter
            selected={tempFilters.paymentMethods}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, paymentMethods: val })
            }
          />
        );
      case "currency":
        return (
          <CurrencyFilter
            selected={tempFilters.currency}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, currency: val })
            }
          />
        );
      case "language":
        return (
          <LanguageFilter
            selected={tempFilters.language}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, language: val })
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
      location: "Select Location",
      year: "Select Year Range",
      payment: "Payment Methods",
      currency: "Select Currency",
      language: "Select Language",
    };
    return titles[activeBottomSheet] || "Filter";
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* 👇 FULL WIDTH BANNER - Desktop Only */}
        <Banner />

        <div className="flex w-full">
          {/* Desktop Sidebar - Sticky after banner */}
          <div className="hidden lg:block">
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>

          <div className="flex-1 w-full">
            {/* Mobile Filter Pills */}
            <FilterPillsBar
              activeFilters={filters}
              onPillClick={handlePillClick}
            />

            {/* Applied Filters */}
            <AppliedFilters
              filters={filters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
            />

            {/* Company Cards */}
            <div className="px-4 sm:px-6 py-3 sm:py-2 mt-15 sm:mt-2">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                  {companiesData.map((company) => {
                    const seller = sellersData.find(
                      (s) => s._id === company.sellerId
                    );
                    return (
                      <CompanyCard
                        key={company._id}
                        company={company}
                        seller={seller}
                        onClick={(id) => navigate(`/company/${id}`)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Sheet */}
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

export default Companies;
