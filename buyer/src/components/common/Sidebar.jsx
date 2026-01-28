import { useState, useEffect, useCallback } from "react";
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
  Ruler,
  Weight,
  ArrowUpDown,
} from "lucide-react";
import { Country, State, City } from "country-state-city";

const Sidebar = ({ type = "company", companyId = null }) => {
  const dispatch = useDispatch();
  const { companyFilters, productFilters, pagination } = useSelector(
    (state) => state.company
  );

  // Select active filters based on type
  const activeFilters = type === "company" ? companyFilters : productFilters;

  // Local state for debounced inputs
  const [localFilters, setLocalFilters] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

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
    size: false,
    weight: false,
    sortBy: false,
    newArrivals: false,
  });

  // Initialize local filters from Redux
  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [type]);

  // Country-State-City handlers
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry);
      setAvailableStates(states);
      setAvailableCities([]);
      setSelectedState("");
    } else {
      setAvailableStates([]);
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, selectedState]);

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

  // Debounced input handler - FIX FOR FOCUS ISSUE
  const handleInputChange = useCallback((filterKey, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  }, []);

  // Apply filters after debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const hasChanges = Object.keys(localFilters).some(
        (key) => localFilters[key] !== activeFilters[key]
      );

      if (hasChanges) {
        if (type === "company") {
          dispatch(setCompanyFilters(localFilters));
          dispatch(
            fetchCompanies({
              page: 1,
              limit: pagination.limit,
              filters: { ...companyFilters, ...localFilters },
            })
          );
        } else {
          dispatch(setProductFilters(localFilters));
          dispatch(
            fetchCompaniesProduct({
              companyId,
              page: 1,
              limit: pagination.limit,
              filters: { ...productFilters, ...localFilters },
            })
          );
        }
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timeoutId);
  }, [localFilters]);

  const handleRangeChange = (filterKey, value) => {
    const parsedValue = parseInt(value);
    setLocalFilters((prev) => ({
      ...prev,
      [filterKey]: parsedValue,
    }));
  };

  const applyRangeFilter = () => {
    if (type === "company") {
      dispatch(setCompanyFilters(localFilters));
      dispatch(
        fetchCompanies({
          page: 1,
          limit: pagination.limit,
          filters: { ...companyFilters, ...localFilters },
        })
      );
    } else {
      dispatch(setProductFilters(localFilters));
      dispatch(
        fetchCompaniesProduct({
          companyId,
          page: 1,
          limit: pagination.limit,
          filters: { ...productFilters, ...localFilters },
        })
      );
    }
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    setSelectedCountry("");
    setSelectedState("");

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
    colors: [
      { name: "White", hex: "#FFFFFF", border: true },
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Brown", hex: "#8B4513" },
      { name: "Red", hex: "#DC143C" },
      { name: "Pink", hex: "#FFC0CB" },
      { name: "Orange", hex: "#FF8C00" },
      { name: "Yellow", hex: "#FFD700" },
      { name: "Green", hex: "#228B22" },
      { name: "Blue", hex: "#4169E1" },
      { name: "Purple", hex: "#9370DB" },
    ],
    sortOptions: [
      { value: "priceAsc", label: "Price: Low to High" },
      { value: "priceDesc", label: "Price: High to Low" },
      { value: "newest", label: "Newest First" },
      { value: "mostViewed", label: "Most Viewed" },
    ],
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

  // Color Picker Component
  const ColorPicker = () => {
    const selectedColors = activeFilters.color || [];

    const handleColorToggle = (colorName) => {
      const lowerColorName = colorName.toLowerCase();
      const newColors = selectedColors.includes(lowerColorName)
        ? selectedColors.filter((c) => c !== lowerColorName)
        : [...selectedColors, lowerColorName];

      dispatch(setProductFilters({ color: newColors }));
      dispatch(
        fetchCompaniesProduct({
          companyId,
          page: 1,
          limit: pagination.limit,
          filters: { ...productFilters, color: newColors },
        })
      );
    };

    return (
      <div className="grid grid-cols-4 gap-3">
        {productFilterOptions.colors.map((color) => (
          <button
            key={color.name}
            onClick={() => handleColorToggle(color.name)}
            className="relative group flex flex-col items-center gap-1.5"
            title={color.name}
          >
            <div
              className={`w-12 h-12 rounded-full transition-all ${
                selectedColors.includes(color.name.toLowerCase())
                  ? "ring-4 ring-blue-500 ring-offset-2 scale-110"
                  : "ring-2 ring-gray-200 hover:ring-blue-300 hover:scale-105"
              } ${color.border ? "border-2 border-gray-300" : ""}`}
              style={{ backgroundColor: color.hex }}
            >
              {selectedColors.includes(color.name.toLowerCase()) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600 drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 group-hover:text-blue-600 font-medium text-center">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // Modern Location Filter with country-state-city
  const LocationFilter = () => {
    const countries = Country.getAllCountries();

    return (
      <div className="space-y-3">
        {/* Country Dropdown */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => {
              const countryCode = e.target.value;
              setSelectedCountry(countryCode);
              const country = countries.find((c) => c.isoCode === countryCode);
              handleInputChange("country", country?.name || "");
            }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        {selectedCountry && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              State/Province
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                const stateCode = e.target.value;
                setSelectedState(stateCode);
                const state = availableStates.find(
                  (s) => s.isoCode === stateCode
                );
                handleInputChange("state", state?.name || "");
              }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">Select State</option>
              {availableStates.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* City Dropdown */}
        {selectedState && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              City
            </label>
            <select
              value={localFilters.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">Select City</option>
              {availableCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

  // Modern Origin Filter with country-state-city
  const OriginFilter = () => {
    const countries = Country.getAllCountries();
    const [originCountry, setOriginCountry] = useState("");
    const [originState, setOriginState] = useState("");
    const [originStates, setOriginStates] = useState([]);
    const [originCities, setOriginCities] = useState([]);

    useEffect(() => {
      if (originCountry) {
        const states = State.getStatesOfCountry(originCountry);
        setOriginStates(states);
        setOriginCities([]);
        setOriginState("");
      } else {
        setOriginStates([]);
        setOriginCities([]);
      }
    }, [originCountry]);

    useEffect(() => {
      if (originCountry && originState) {
        const cities = City.getCitiesOfState(originCountry, originState);
        setOriginCities(cities);
      } else {
        setOriginCities([]);
      }
    }, [originCountry, originState]);

    return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Origin Country
          </label>
          <select
            value={originCountry}
            onChange={(e) => {
              const countryCode = e.target.value;
              setOriginCountry(countryCode);
              const country = countries.find((c) => c.isoCode === countryCode);
              handleInputChange("origin", country?.name || "");
            }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
          >
            <option value="">Select Origin Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>

        {originCountry && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Origin State (Optional)
            </label>
            <select
              value={originState}
              onChange={(e) => {
                const stateCode = e.target.value;
                setOriginState(stateCode);
                const state = originStates.find((s) => s.isoCode === stateCode);
                if (state) {
                  handleInputChange("originState", state.name);
                }
              }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">Select State</option>
              {originStates.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {originState && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Origin City (Optional)
            </label>
            <select
              value={localFilters.originCity || ""}
              onChange={(e) => handleInputChange("originCity", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">Select City</option>
              {originCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

  // ✅ FIXED - Modern Range Slider Component with smooth sliding
  const RangeSlider = ({ min, max, minKey, maxKey, label, unit = "" }) => {
    const minValue = localFilters[minKey] || min;
    const maxValue = localFilters[maxKey] || max;

    // ✅ Handle smooth sliding - updates local state immediately
    const handleSliderChange = (key, value) => {
      const parsedValue = parseInt(value);
      setLocalFilters((prev) => ({
        ...prev,
        [key]: parsedValue,
      }));
    };

    // ✅ Direct input change for text inputs with validation
    const handleDirectInput = (key, value) => {
      const parsedValue = parseInt(value) || min;
      const clampedValue = Math.max(min, Math.min(max, parsedValue));

      setLocalFilters((prev) => ({
        ...prev,
        [key]: clampedValue,
      }));
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className="font-semibold text-blue-600">
            {unit}
            {minValue} - {unit}
            {maxValue}
          </span>
        </div>

        <div className="relative pt-1 space-y-3">
          {/* Min Range Slider - ✅ FIXED with onInput for smooth sliding */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Minimum
            </label>
            <input
              type="range"
              min={min}
              max={maxValue} // ✅ Can't exceed max value
              value={minValue}
              onInput={(e) => handleSliderChange(minKey, e.target.value)} // ✅ Smooth real-time sliding
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                  ((minValue - min) / (max - min)) * 100
                }%, #E5E7EB ${
                  ((minValue - min) / (max - min)) * 100
                }%, #E5E7EB 100%)`,
              }}
            />
          </div>

          {/* Max Range Slider - ✅ FIXED with onInput for smooth sliding */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Maximum
            </label>
            <input
              type="range"
              min={minValue} // ✅ Can't go below min value
              max={max}
              value={maxValue}
              onInput={(e) => handleSliderChange(maxKey, e.target.value)} // ✅ Smooth real-time sliding
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #E5E7EB 0%, #E5E7EB ${
                  ((maxValue - min) / (max - min)) * 100
                }%, #3B82F6 ${
                  ((maxValue - min) / (max - min)) * 100
                }%, #3B82F6 100%)`,
              }}
            />
          </div>
        </div>

        {/* Value indicators - ✅ Improved UX with validation */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Min:</label>
            <input
              type="number"
              value={minValue}
              onChange={(e) => handleDirectInput(minKey, e.target.value)}
              min={min}
              max={maxValue}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Max:</label>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => handleDirectInput(maxKey, e.target.value)}
              min={minValue}
              max={max}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-70 bg-white border-r border-gray-200 sticky top-20 h-[calc(100vh-80px)] flex flex-col sidebar-scrollbar">
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

            {/* UPDATED LOCATION FILTER */}
            <FilterSection title="Location" icon={MapPin} section="location">
              <LocationFilter />
            </FilterSection>

            <FilterSection
              title="Registration Year"
              icon={Calendar}
              section="year"
            >
              <RangeSlider
                min={1990}
                max={2025}
                minKey="yearFrom"
                maxKey="yearTo"
                label="Year Range"
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

            {/* Sort By */}
            <FilterSection title="Sort By" icon={ArrowUpDown} section="sortBy">
              <select
                value={productFilters.sortBy || ""}
                onChange={(e) => {
                  dispatch(setProductFilters({ sortBy: e.target.value }));
                  dispatch(
                    fetchCompaniesProduct({
                      companyId,
                      page: 1,
                      limit: pagination.limit,
                      filters: { ...productFilters, sortBy: e.target.value },
                    })
                  );
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                <option value="">Default Sorting</option>
                {productFilterOptions.sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FilterSection>

            {/* Category Filter */}
            <FilterSection title="Category" icon={Layers} section="category">
              <CheckboxGroup
                options={productFilterOptions.categories}
                filterKey="category"
              />
            </FilterSection>

            {/* Sub Category Filter */}
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

            {/* Grade Filter */}
            <FilterSection title="Grade" icon={Award} section="grade">
              <CheckboxGroup
                options={productFilterOptions.grades}
                filterKey="grade"
              />
            </FilterSection>

            {/* Color Filter */}
            <FilterSection title="Color" icon={Palette} section="color">
              <ColorPicker />
            </FilterSection>

            {/* UPDATED ORIGIN FILTER */}
            <FilterSection title="Origin" icon={MapPinned} section="origin">
              <OriginFilter />
            </FilterSection>

            {/* UPDATED PRICE RANGE WITH SLIDER */}
            <FilterSection
              title="Price Range"
              icon={TrendingUp}
              section="price"
            >
              <RangeSlider
                min={0}
                max={500}
                minKey="priceMin"
                maxKey="priceMax"
                label="Price per Unit"
                unit="₹"
              />
            </FilterSection>

            {/* Size Filter */}
            <FilterSection title="Size" icon={Ruler} section="size">
              <div className="space-y-4">
                {/* Length */}
                <RangeSlider
                  min={0}
                  max={100}
                  minKey="lengthMin"
                  maxKey="lengthMax"
                  label="Length (ft)"
                />

                {/* Width */}
                <RangeSlider
                  min={0}
                  max={100}
                  minKey="widthMin"
                  maxKey="widthMax"
                  label="Width (ft)"
                />

                {/* Thickness */}
                <RangeSlider
                  min={0}
                  max={10}
                  minKey="thicknessMin"
                  maxKey="thicknessMax"
                  label="Thickness (inch)"
                />
              </div>
            </FilterSection>

            {/* Weight Filter */}
            <FilterSection title="Weight" icon={Weight} section="weight">
              <RangeSlider
                min={0}
                max={1000}
                minKey="weightMin"
                maxKey="weightMax"
                label="Weight (kg)"
              />
            </FilterSection>

            {/* New Arrivals Filter */}
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
