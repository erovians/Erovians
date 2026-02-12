import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCompanies,
  setCompanyFilters,
  clearCompanyFilters,
} from "../lib/redux/company/companySlice";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import CompanyCard from "../components/cards/CompanyCard";
import Banner from "../components/common/Banner";
import FilterPillsBar from "../components/filters/FilterPillsBar";
import AppliedFilters from "../components/filters/AppliedFilters";
import FilterBottomSheet from "../components/filters/FilterBottomSheet";
import CategoryFilter from "../components/filters/filters/CategoryFilter";
import SubCategoryFilter from "../components/filters/filters/SubCategoryFilter";
import LocationFilter from "../components/filters/filters/LocationFilter";
import YearFilter from "../components/filters/filters/YearFilter";
import PaymentFilter from "../components/filters/filters/PaymentFilter";
import CurrencyFilter from "../components/filters/filters/CurrencyFilter";
import LanguageFilter from "../components/filters/filters/LanguageFilter";
import NewArrivalsFilter from "../components/filters/filters/NewArrivalsFilter";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { Loader2 } from "lucide-react";

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { companies, pagination, companyFilters, loading, error } = useSelector(
    (state) => state.company
  );

  const [tempFilters, setTempFilters] = useState(companyFilters);
  const [activeBottomSheet, setActiveBottomSheet] = useState(null);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchCompanies({ page: 1, limit: 10, filters: companyFilters }));
  }, [dispatch]);

  // Re-fetch when filters change
  useEffect(() => {
    dispatch(fetchCompanies({ page: 1, limit: 10, filters: companyFilters }));
  }, [companyFilters, dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(
      fetchCompanies({
        page: newPage,
        limit: pagination.limit,
        filters: companyFilters,
      })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePillClick = (filterId) => {
    setTempFilters(companyFilters);
    setActiveBottomSheet(filterId);
  };

  const handleApplyFilter = () => {
    dispatch(setCompanyFilters(tempFilters));
    setActiveBottomSheet(null);
  };

  const handleRemoveFilter = (type, value) => {
    const updatedFilters = { ...companyFilters };

    if (Array.isArray(updatedFilters[type])) {
      updatedFilters[type] = updatedFilters[type].filter((v) => v !== value);
    } else if (typeof updatedFilters[type] === "boolean") {
      updatedFilters[type] = false;
    } else {
      updatedFilters[type] = "";
    }

    dispatch(setCompanyFilters(updatedFilters));
  };

  // ✅ UPDATED - Enhanced Clear All Function
  const handleClearAll = () => {
    // Clear temp filters immediately
    setTempFilters({
      mainCategory: [],
      subCategory: [],
      country: "",
      state: "",
      city: "",
      yearFrom: null,
      yearTo: null,
      paymentMethods: [],
      currency: [],
      language: [],
      newArrivals: false,
    });

    // Clear Redux filters
    dispatch(clearCompanyFilters());
  };

  const handleYearChange = (value) => {
    setTempFilters({
      ...tempFilters,
      yearFrom: value[0],
      yearTo: value[1],
    });
  };

  const handleLocationChange = (type, value) => {
    setTempFilters({ ...tempFilters, [type]: value });
  };

  const renderFilterContent = () => {
    switch (activeBottomSheet) {
      case "category":
        return (
          <CategoryFilter
            selected={tempFilters.mainCategory || []}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, mainCategory: val })
            }
          />
        );
      case "subCategory":
        return (
          <SubCategoryFilter
            selected={tempFilters.subCategory || []}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, subCategory: val })
            }
          />
        );
      case "location":
        return (
          <LocationFilter
            country={tempFilters.country || ""}
            state={tempFilters.state || ""}
            city={tempFilters.city || ""}
            onChange={handleLocationChange}
          />
        );
      case "year":
        return (
          <YearFilter
            yearRange={[
              tempFilters.yearFrom || 1990,
              tempFilters.yearTo || 2025,
            ]}
            onChange={handleYearChange}
          />
        );
      case "payment":
        return (
          <PaymentFilter
            selected={tempFilters.paymentMethods || []}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, paymentMethods: val })
            }
          />
        );
      case "currency":
        return (
          <CurrencyFilter
            selected={tempFilters.currency || []}
            onChange={(val) =>
              setTempFilters({ ...tempFilters, currency: val })
            }
          />
        );
      case "language":
        return (
          <LanguageFilter
            selected={tempFilters.language || []}
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
      subCategory: "Select Sub Category",
      location: "Select Location",
      year: "Select Year Range",
      payment: "Select Payment Methods",
      currency: "Select Currency",
      language: "Select Language",
    };
    return titles[activeBottomSheet] || "Filter";
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <Banner />

        <div className="flex w-full">
          <div className="hidden lg:block">
            <Sidebar type="company" />
          </div>

          <div className="flex-1 w-full">
            <FilterPillsBar
              type="company"
              activeFilters={companyFilters}
              onPillClick={handlePillClick}
            />

            <AppliedFilters
              type="company"
              filters={companyFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
            />

            {loading && <LoadingOverlay message="Loading companies..." />}

            {error && !loading && (
              <div className="flex items-center justify-center h-96">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                  <h3 className="text-red-800 font-semibold text-lg mb-2">
                    Error Loading Companies
                  </h3>
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={() =>
                      dispatch(
                        fetchCompanies({
                          page: 1,
                          limit: 10,
                          filters: companyFilters,
                        })
                      )
                    }
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                {companies?.length === 0 ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏢</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Companies Found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your filters
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="px-4 sm:px-6 py-6">
                      <div className="max-w-7xl mx-auto mb-4">
                        <p className="text-sm text-gray-600">
                          Showing{" "}
                          <span className="font-semibold text-gray-900">
                            {companies?.length}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold text-gray-900">
                            {pagination.totalCompanies}
                          </span>{" "}
                          companies
                        </p>
                      </div>

                      <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                          {companies?.map((company) => (
                            <CompanyCard
                              key={company._id}
                              company={company}
                              seller={company.seller}
                              onClick={(id) => navigate(`/company/${id}`)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 py-8 px-4">
                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={pagination.currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>

                        <div className="flex items-center gap-2">
                          {[...Array(pagination.totalPages)].map((_, idx) => {
                            const pageNum = idx + 1;
                            if (
                              pageNum === 1 ||
                              pageNum === pagination.totalPages ||
                              (pageNum >= pagination.currentPage - 1 &&
                                pageNum <= pagination.currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                    pageNum === pagination.currentPage
                                      ? "bg-blue-600 text-white"
                                      : "border border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            } else if (
                              pageNum === pagination.currentPage - 2 ||
                              pageNum === pagination.currentPage + 2
                            ) {
                              return (
                                <span key={pageNum} className="px-2">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* ✅ ONLY CHANGE - Added onClearAll prop */}
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

export default Companies;
