// src/components/common/Sidebar.jsx
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
  Package,
  Layers,
  Award,
  Palette,
  Ruler,
  Weight,
  Sparkles,
  Tag,
} from "lucide-react";

const Sidebar = ({ type = "company" }) => {
  const [expandedSections, setExpandedSections] = useState({
    mainCategory: true,
    subCategory: false,
    location: false,
    year: false,
    payment: false,
    currency: false,
    language: false,
    grade: false,
    color: false,
    size: false,
    weight: false,
    weightUnit: false,
    priceUnit: false,
    newArrivals: false,
  });

  const [filters, setFilters] = useState({
    mainCategory: [],
    subCategory: [],
    country: "",
    state: "",
    city: "",
    yearRange: [1990, 2025],
    paymentMethods: [],
    currency: [],
    language: [],

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
    if (type === "company") {
      setFilters({
        mainCategory: [],
        subCategory: [],
        country: "",
        state: "",
        city: "",
        yearRange: [1990, 2025],
        paymentMethods: [],
        currency: [],
        language: [],
      });
    } else {
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
    }
  };

  const getAppliedFiltersCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) count += value.length;
      else if (typeof value === "string" && value) count++;
      else if (typeof value === "boolean" && value) count++;
    });
    return count;
  };

  // Filter Options
  const filterOptions = {
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
    ],
    countries: ["India", "China", "Italy", "Turkey", "Brazil"],
    paymentMethods: ["Cash", "Credit Card", "Bank Transfer", "LC", "PayPal"],
    currencies: ["USD", "EUR", "INR", "GBP", "CNY"],
    languages: ["English", "Hindi", "Spanish", "Chinese", "Arabic"],
    grades: ["A", "B", "C"],
    colors: [
      "White",
      "Black",
      "Grey",
      "Beige",
      "Brown",
      "Red",
      "Green",
      "Blue",
      "Yellow",
      "Pink",
    ],
    priceUnits: ["sq.ft", "sq.m", "piece"],
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
            checked={filters[filterKey].includes(option)}
            onChange={() => handleCheckboxChange(filterKey, option)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
            {option}
          </span>
        </label>
      ))}
    </div>
  );

  const RangeSlider = ({ label, min, max, value, onChange, unit = "" }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-700">
          {value[0]}
          {unit} - {value[1]}
          {unit}
        </span>
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => onChange(0, e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange(1, e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
        />
      </div>
    </div>
  );

  return (
    <div className="w-70 bg-white border-r border-gray-200 sticky top-20 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center  gap-3 ">
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
            <FilterSection
              title="Main Category"
              icon={Building2}
              section="mainCategory"
            >
              <CheckboxGroup
                options={filterOptions.mainCategories}
                filterKey="mainCategory"
              />
            </FilterSection>

            <FilterSection
              title="Sub Category"
              icon={Layers}
              section="subCategory"
            >
              <CheckboxGroup
                options={filterOptions.subCategories}
                filterKey="subCategory"
              />
            </FilterSection>

            <FilterSection title="Location" icon={MapPin} section="location">
              <div className="space-y-3">
                <select
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Country</option>
                  {filterOptions.countries.map((c) => (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </FilterSection>

            <FilterSection
              title="Registration Year"
              icon={Calendar}
              section="year"
            >
              <RangeSlider
                label="Year Range"
                min={1990}
                max={2025}
                value={filters.yearRange}
                onChange={(idx, val) =>
                  handleRangeChange("yearRange", idx, val)
                }
              />
            </FilterSection>

            <FilterSection
              title="Payment Methods"
              icon={DollarSign}
              section="payment"
            >
              <CheckboxGroup
                options={filterOptions.paymentMethods}
                filterKey="paymentMethods"
              />
            </FilterSection>

            <FilterSection
              title="Currency"
              icon={DollarSign}
              section="currency"
            >
              <CheckboxGroup
                options={filterOptions.currencies}
                filterKey="currency"
              />
            </FilterSection>

            <FilterSection title="Language" icon={Globe} section="language">
              <CheckboxGroup
                options={filterOptions.languages}
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
                  checked={filters.newArrivals}
                  onChange={(e) =>
                    setFilters({ ...filters, newArrivals: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Show New Company
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Company added in last 7 days
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-gray-900" />
              </label>
            </FilterSection>
          </>
        ) : (
          <>
            <FilterSection
              title="Category"
              icon={Package}
              section="mainCategory"
            >
              <CheckboxGroup
                options={filterOptions.mainCategories}
                filterKey="mainCategory"
              />
            </FilterSection>

            <FilterSection
              title="Sub Category"
              icon={Layers}
              section="subCategory"
            >
              <CheckboxGroup
                options={filterOptions.subCategories}
                filterKey="subCategory"
              />
            </FilterSection>

            <FilterSection title="Grade" icon={Award} section="grade">
              <CheckboxGroup options={filterOptions.grades} filterKey="grade" />
            </FilterSection>

            <FilterSection title="Color" icon={Palette} section="color">
              <div className="space-y-2">
                {filterOptions.colors.map((color) => (
                  <label
                    key={color}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.color.includes(color)}
                      onChange={() => handleCheckboxChange("color", color)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div
                      className="w-5 h-5 rounded-full border-2 border-gray-300"
                      style={{
                        backgroundColor: color.toLowerCase(),
                      }}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                      {color}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Size (cm)" icon={Ruler} section="size">
              <div className="space-y-4">
                <RangeSlider
                  label="Length"
                  min={0}
                  max={300}
                  value={filters.length}
                  onChange={(idx, val) => handleRangeChange("length", idx, val)}
                  unit=" cm"
                />
                <RangeSlider
                  label="Width"
                  min={0}
                  max={300}
                  value={filters.width}
                  onChange={(idx, val) => handleRangeChange("width", idx, val)}
                  unit=" cm"
                />
                <RangeSlider
                  label="Thickness"
                  min={0}
                  max={10}
                  value={filters.thickness}
                  onChange={(idx, val) =>
                    handleRangeChange("thickness", idx, val)
                  }
                  unit=" cm"
                />
              </div>
            </FilterSection>

            <FilterSection title="Weight" icon={Weight} section="weight">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="weightUnit"
                      value="kg"
                      checked={filters.weightUnit === "kg"}
                      onChange={(e) =>
                        setFilters({ ...filters, weightUnit: e.target.value })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Kilogram (kg)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="weightUnit"
                      value="ton"
                      checked={filters.weightUnit === "ton"}
                      onChange={(e) =>
                        setFilters({ ...filters, weightUnit: e.target.value })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Ton</span>
                  </label>
                </div>

                <RangeSlider
                  label="Weight Range"
                  min={0}
                  max={filters.weightUnit === "kg" ? 1000 : 100}
                  value={filters.weightRange}
                  onChange={(idx, val) =>
                    handleRangeChange("weightRange", idx, val)
                  }
                  unit={` ${filters.weightUnit}`}
                />
              </div>
            </FilterSection>

            <FilterSection title="Price Unit" icon={Tag} section="priceUnit">
              <CheckboxGroup
                options={filterOptions.priceUnits}
                filterKey="priceUnit"
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
                  checked={filters.newArrivals}
                  onChange={(e) =>
                    setFilters({ ...filters, newArrivals: e.target.checked })
                  }
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
