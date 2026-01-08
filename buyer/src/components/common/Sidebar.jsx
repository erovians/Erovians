// src/components/Sidebar/FilterSidebar.jsx
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  X,
} from "lucide-react";

const Sidebar = ({ isCollapsed, onToggle }) => {
  const [expandedSections, setExpandedSections] = useState({
    mainCategory: true,
    location: false,
    year: false,
    payment: false,
    currency: false,
    language: false,
  });

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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(value)
        ? prev[filterKey].filter((v) => v !== value)
        : [...prev[filterKey], value],
    }));
  };

  const handleRangeChange = (filterKey, index, value) => {
    setFilters((prev) => {
      const newRange = [...prev[filterKey]];
      newRange[index] = parseInt(value);
      return { ...prev, [filterKey]: newRange };
    });
  };

  const clearAllFilters = () => {
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

  const getAppliedFiltersCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) count += value.length;
      else if (typeof value === "string" && value) count++;
    });
    return count;
  };

  const companyFilterOptions = {
    mainCategories: [
      "Natural Stones",
      "Ceramic & Tiles",
      "Alternatives & Finishes",
    ],
    countries: ["India", "China", "Italy", "Turkey", "Brazil"],
    paymentMethods: ["Cash", "Credit Card", "Bank Transfer", "LC", "PayPal"],
    currencies: ["USD", "EUR", "INR", "GBP", "CNY"],
    languages: ["English", "Hindi", "Spanish", "Chinese", "Arabic"],
  };

  const FilterSection = ({ title, icon: Icon, section, children }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-navyblue" />
          <span className="font-medium text-sm text-gray-900">{title}</span>
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
            checked={filters[filterKey].includes(option)}
            onChange={() => handleCheckboxChange(filterKey, option)}
            className="w-4 h-4 text-navyblue border-gray-300 rounded focus:ring-navyblue"
          />
          <span className="text-sm text-gray-700 group-hover:text-navyblue transition-colors">
            {option}
          </span>
        </label>
      ))}
    </div>
  );

  const RangeSlider = ({ label, min, max, value, onChange }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-navyblue">
          {value[0]} - {value[1]}
        </span>
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => onChange(0, e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navyblue"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange(1, e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navyblue"
        />
      </div>
    </div>
  );

  // ✅ Collapsed State - Icon Only
  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4 sticky top-20 h-[calc(100vh-80px)]">
        <button
          onClick={onToggle}
          className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
          title="Open Filters"
        >
          <SlidersHorizontal className="w-5 h-5 text-navyblue" />
        </button>
      </div>
    );
  }

  // ✅ Expanded State - Full Sidebar
  return (
    <div className="w-80 bg-white border-r border-gray-200 sticky top-20 h-[calc(100vh-80px)] flex flex-col">
      {/* Header - Fixed */}
      <div className="bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-navyblue" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            {getAppliedFiltersCount() > 0 && (
              <span className="bg-navyblue text-white text-xs px-2 py-1 rounded-full font-semibold">
                {getAppliedFiltersCount()}
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close Filters"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        {getAppliedFiltersCount() > 0 && (
          <div className="px-4 pb-3">
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Filters Content - Scrollable */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
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

        <FilterSection title="Location" icon={MapPin} section="location">
          <div className="space-y-3">
            <select
              value={filters.country}
              onChange={(e) =>
                setFilters({ ...filters, country: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navyblue focus:border-navyblue outline-none"
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
              value={filters.state}
              onChange={(e) =>
                setFilters({ ...filters, state: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navyblue focus:border-navyblue outline-none"
            />
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navyblue focus:border-navyblue outline-none"
            />
          </div>
        </FilterSection>

        <FilterSection title="Registration Year" icon={Calendar} section="year">
          <RangeSlider
            label="Year Range"
            min={1990}
            max={2025}
            value={filters.yearRange}
            onChange={(idx, val) => handleRangeChange("yearRange", idx, val)}
          />
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

        <FilterSection title="Currency" icon={DollarSign} section="currency">
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
      </div>
    </div>
  );
};

export default Sidebar;
