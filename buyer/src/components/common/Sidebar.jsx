import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCompanyFilters,
  clearCompanyFilters,
  setProductFilters,
  clearProductFilters,
  fetchCompanies,
  fetchCompaniesProduct,
} from "../../lib/redux/company/companySlice";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  Layers,
  Sparkles,
  Award,
  Palette,
  MapPinned,
  TrendingUp,
} from "lucide-react";

const Sidebar = ({ type = "company", companyId = null }) => {
  const dispatch = useDispatch();
  const { companyFilters, productFilters, pagination } = useSelector(
    (state) => state.company
  );

  // Select active filters based on type
  const activeFilters = type === "company" ? companyFilters : productFilters;

  const [expandedSections, setExpandedSections] = useState({
    mainCategory: true,
    category: true,
    subCategory: false,
    location: false,
    year: false,
    payment: false,
    currency: false,
    language: false,
    grade: false,
    color: false,
    origin: false,
    price: false,
    newArrivals: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (filterKey, value) => {
    const currentValues = activeFilters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    if (type === "company") {
      dispatch(setCompanyFilters({ [filterKey]: newValues }));
      dispatch(
        fetchCompanies({
          page: 1,
          limit: pagination.limit,
          filters: { ...companyFilters, [filterKey]: newValues },
        })
      );
    } else {
      dispatch(setProductFilters({ [filterKey]: newValues }));
      dispatch(
        fetchCompaniesProduct({
          companyId,
          page: 1,
          limit: pagination.limit,
          filters: { ...productFilters, [filterKey]: newValues },
        })
      );
    }
  };

  const handleInputChange = (filterKey, value) => {
    if (type === "company") {
      dispatch(setCompanyFilters({ [filterKey]: value }));
    } else {
      dispatch(setProductFilters({ [filterKey]: value }));
    }
  };

  const handleApplyFilters = () => {
    if (type === "company") {
      dispatch(
        fetchCompanies({
          page: 1,
          limit: pagination.limit,
          filters: companyFilters,
        })
      );
    } else {
      dispatch(
        fetchCompaniesProduct({
          companyId,
          page: 1,
          limit: pagination.limit,
          filters: productFilters,
        })
      );
    }
  };

  const handleRangeChange = (filterKey, value) => {
    if (type === "company") {
      dispatch(setCompanyFilters({ [filterKey]: parseInt(value) }));
    } else {
      dispatch(setProductFilters({ [filterKey]: parseInt(value) }));
    }
  };

  const clearAllFilters = () => {
    if (type === "company") {
      dispatch(clearCompanyFilters());
      dispatch(
        fetchCompanies({ page: 1, limit: pagination.limit, filters: {} })
      );
    } else {
      dispatch(clearProductFilters());
      dispatch(
        fetchCompaniesProduct({
          companyId,
          page: 1,
          limit: pagination.limit,
          filters: {},
        })
      );
    }
  };

  const getAppliedFiltersCount = () => {
    let count = 0;
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) count += value.length;
      else if (typeof value === "string" && value) count++;
      else if (typeof value === "boolean" && value) count++;
      else if (typeof value === "number" && value !== null) count++;
    });
    return count;
  };

  // Company Filter Options
  const companyFilterOptions = {
    mainCategories: [
      "Natural Stones",
      "Ceramic & Tiles",
      "Alternatives & Finishes",
    ],
    subCategories: [
      "Marble",
      "Granite",
      "Limestone",
      "Sandstone",
      "Quartzite",
      "Onyx",
      "Travertine",
      "Ceramic",
      "Porcelain",
    ],
    countries: ["India", "China", "Italy", "Turkey", "Brazil", "Albania"],
    paymentMethods: ["Cash", "Credit Card", "Bank Transfer", "LC", "PayPal"],
    currencies: ["USD", "EUR", "INR", "GBP", "CNY"],
    languages: ["English", "Hindi", "Spanish", "Chinese", "Arabic"],
  };

  // Product Filter Options
  const productFilterOptions = {
    categories: [
      "Natural Stones",
      "Ceramic & Tiles",
      "Alternatives & Finishes",
    ],
    subCategories: [
      "Marble",
      "Granite",
      "Limestone",
      "Sandstone",
      "Quartzite",
      "Onyx",
      "Travertine",
      "Ceramic",
      "Porcelain",
    ],
    grades: ["A", "B", "C"],
  };

  const FilterSection = ({ title, icon: Icon, section, children }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-900" />
          <span className="font-semibold text-sm text-gray-900">{title}</span>
        </div>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && <div className="px-4 pb-4">{children}</div>}
    </div>
  );

  const CheckboxGroup = ({ options, filterKey }) => (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={(activeFilters[filterKey] || []).includes(
              option.toLowerCase()
            )}
            onChange={() =>
              handleCheckboxChange(filterKey, option.toLowerCase())
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
            {option}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="w-70 bg-white border-r border-gray-200 sticky top-20 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-6 h-6 text-gray-900" />
            <h2 className="text-lg font-bold text-gray-900">
              {type === "company" ? "Company Filters" : "Product Filters"}
            </h2>
            {getAppliedFiltersCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                {getAppliedFiltersCount()}
              </span>
            )}
          </div>
        </div>
        {getAppliedFiltersCount() > 0 && (
          <div className="px-4 pb-3">
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors flex items-center gap-1"
            >
              <span>✕</span> Clear All Filters
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {type === "company" ? (
          <>
            {/* Company Filters */}
            <FilterSection
              title="Main Category"
              icon={Building2}
              section="mainCategory"
            >
              <CheckboxGroup
                options={companyFilterOptions.mainCategories}
                filterKey="mainCategory"
              />
            </FilterSection>

            <FilterSection
              title="Sub Category"
              icon={Layers}
              section="subCategory"
            >
              <CheckboxGroup
                options={companyFilterOptions.subCategories}
                filterKey="subCategory"
              />
            </FilterSection>

            <FilterSection title="Location" icon={MapPin} section="location">
              <div className="space-y-3">
                <select
                  value={companyFilters.country || ""}
                  onChange={(e) => {
                    handleInputChange("country", e.target.value);
                    handleApplyFilters();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Country</option>
                  {companyFilterOptions.countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="State/Province"
                  value={companyFilters.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  onBlur={handleApplyFilters}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={companyFilters.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  onBlur={handleApplyFilters}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </FilterSection>

            <FilterSection
              title="Registration Year"
              icon={Calendar}
              section="year"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Year Range</span>
                  <span className="font-semibold text-gray-700">
                    {companyFilters.yearFrom || 1990} -{" "}
                    {companyFilters.yearTo || 2025}
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={1990}
                    max={2025}
                    value={companyFilters.yearFrom || 1990}
                    onChange={(e) =>
                      handleRangeChange("yearFrom", e.target.value)
                    }
                    onMouseUp={handleApplyFilters}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                  />
                  <input
                    type="range"
                    min={1990}
                    max={2025}
                    value={companyFilters.yearTo || 2025}
                    onChange={(e) =>
                      handleRangeChange("yearTo", e.target.value)
                    }
                    onMouseUp={handleApplyFilters}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection
              title="Payment Methods"
              icon={DollarSign}
              section="payment"
            >
              <CheckboxGroup
                options={companyFilterOptions.paymentMethods}
                filterKey="paymentMethods"
              />
            </FilterSection>

            <FilterSection
              title="Currency"
              icon={DollarSign}
              section="currency"
            >
              <CheckboxGroup
                options={companyFilterOptions.currencies}
                filterKey="currency"
              />
            </FilterSection>

            <FilterSection title="Language" icon={Globe} section="language">
              <CheckboxGroup
                options={companyFilterOptions.languages}
                filterKey="language"
              />
            </FilterSection>

            <FilterSection
              title="New Arrivals"
              icon={Sparkles}
              section="newArrivals"
            >
              <label className="flex items-center gap-3 cursor-pointer group p-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all">
                <input
                  type="checkbox"
                  checked={companyFilters.newArrivals || false}
                  onChange={(e) => {
                    dispatch(
                      setCompanyFilters({ newArrivals: e.target.checked })
                    );
                    dispatch(
                      fetchCompanies({
                        page: 1,
                        limit: pagination.limit,
                        filters: {
                          ...companyFilters,
                          newArrivals: e.target.checked,
                        },
                      })
                    );
                  }}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Show New Companies
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Companies added in last 7 days
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-gray-900" />
              </label>
            </FilterSection>
          </>
        ) : (
          <>
            {/* Product Filters */}
            <FilterSection title="Category" icon={Layers} section="category">
              <CheckboxGroup
                options={productFilterOptions.categories}
                filterKey="category"
              />
            </FilterSection>

            <FilterSection
              title="Sub Category"
              icon={Building2}
              section="subCategory"
            >
              <CheckboxGroup
                options={productFilterOptions.subCategories}
                filterKey="subCategory"
              />
            </FilterSection>

            <FilterSection title="Grade" icon={Award} section="grade">
              <CheckboxGroup
                options={productFilterOptions.grades}
                filterKey="grade"
              />
            </FilterSection>

            <FilterSection title="Color" icon={Palette} section="color">
              <input
                type="text"
                placeholder="Enter color (e.g., White, Black)"
                value={productFilters.color || ""}
                onChange={(e) => handleInputChange("color", e.target.value)}
                onBlur={handleApplyFilters}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </FilterSection>

            <FilterSection title="Origin" icon={MapPinned} section="origin">
              <input
                type="text"
                placeholder="Enter origin country"
                value={productFilters.origin || ""}
                onChange={(e) => handleInputChange("origin", e.target.value)}
                onBlur={handleApplyFilters}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </FilterSection>

            <FilterSection
              title="Price Range"
              icon={TrendingUp}
              section="price"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Price per Unit</span>
                  <span className="font-semibold text-gray-700">
                    ${productFilters.priceMin || 0} - $
                    {productFilters.priceMax || 1000}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={productFilters.priceMin || ""}
                    onChange={(e) =>
                      handleInputChange("priceMin", e.target.value)
                    }
                    onBlur={handleApplyFilters}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={productFilters.priceMax || ""}
                    onChange={(e) =>
                      handleInputChange("priceMax", e.target.value)
                    }
                    onBlur={handleApplyFilters}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection
              title="New Arrivals"
              icon={Sparkles}
              section="newArrivals"
            >
              <label className="flex items-center gap-3 cursor-pointer group p-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all">
                <input
                  type="checkbox"
                  checked={productFilters.newArrivals || false}
                  onChange={(e) => {
                    dispatch(
                      setProductFilters({ newArrivals: e.target.checked })
                    );
                    dispatch(
                      fetchCompaniesProduct({
                        companyId,
                        page: 1,
                        limit: pagination.limit,
                        filters: {
                          ...productFilters,
                          newArrivals: e.target.checked,
                        },
                      })
                    );
                  }}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Show New Products
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Products added in last 7 days
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-gray-900" />
              </label>
            </FilterSection>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
