import React, { useMemo, useCallback } from "react";
import CountryStateSelect from "../../../Helper/CountryStateSelect";
import {
  User,
  MapPin,
  Calendar,
  Building,
  Layers,
  X,
  Plus,
  DollarSign,
  CreditCard,
  Globe,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const BUSINESS_TYPES = [
  "manufacturer",
  "trading company",
  "distributor",
  "exporter",
  "importer",
  "service provider",
];

const TRADE_CAPABILITIES = [
  "OEM",
  "ODM",
  "Private Label",
  "Custom Manufacturing",
  "Wholesale",
  "Retail",
  "Dropshipping",
];

const CURRENCIES = [
  "USD",
  "EUR",
  "JPY",
  "CAD",
  "AUD",
  "HKD",
  "GBP",
  "CNY",
  "CHF",
];

const PAYMENT_TYPES = [
  "T/T",
  "L/C",
  "D/P D/A",
  "MoneyGram",
  "Credit Card",
  "PayPal",
  "Western Union",
  "Cash",
  "Escrow",
];

const LANGUAGES = [
  "English",
  "Chinese",
  "Spanish",
  "Japanese",
  "Portuguese",
  "German",
  "Arabic",
  "French",
  "Russian",
  "Korean",
  "Hindi",
  "Italian",
];

const CATEGORIES = [
  "Natural Stones",
  "Ceramic & Tiles",
  "Alternatives & Finishes",
];

const YEAR_RANGE = 100;
const CURRENT_YEAR = new Date().getFullYear();

const DEFAULT_FORM_DATA = {
  companyName: "",
  company_registration_number: "", // ✅ NEW
  legalowner: "",
  locationOfRegistration: "",
  companyRegistrationYear: "",
  address: {
    country: "",
    state: "",
    street: "",
    city: "",
    postalCode: "",
  },
  mainCategory: [""],
  mainProduct: [""],
  acceptedCurrency: [],
  acceptedPaymentType: [],
  languageSpoken: [],
  totalEmployees: "",
  businessType: "",
  factorySize: "",
  factoryCountryOrRegion: "",
  contractManufacturing: false,
  numberOfProductionLines: "",
  annualOutputValue: "",
  rdTeamSize: "",
  tradeCapabilities: [],
};

const generateYearOptions = (range, currentYear) => {
  return Array.from({ length: range }, (_, i) => currentYear - i);
};

const getErrorClass = (hasError) =>
  hasError
    ? "border-red-400 focus:ring-red-500"
    : "border-gray-300 hover:border-gray-400";

const extractFieldErrors = (errors, prefix) => {
  const fieldErrors = {};
  Object.keys(errors).forEach((key) => {
    if (key.startsWith(prefix)) {
      const index = key.split(".")[1];
      fieldErrors[index] = errors[key];
    }
  });
  return fieldErrors;
};

const FormField = ({
  name,
  value,
  onChange,
  label,
  icon: Icon,
  error,
  hint,
  required = false,
  type = "text",
  placeholder = "",
}) => (
  <div className="flex flex-col">
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon className="text-gray-400" size={20} aria-hidden="true" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || " "}
        aria-label={label}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : `${name}-hint`}
        className={`text-sm w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navyblue focus:border-transparent ${getErrorClass(
          !!error
        )} bg-white peer`}
      />
      <label className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600 pointer-events-none">
        {label}{" "}
        {required && (
          <span className="text-red-500" aria-label="required">
            *
          </span>
        )}
      </label>
    </div>
    {hint && (
      <p id={`${name}-hint`} className="text-gray-500 text-xs mt-1 ml-1">
        {hint}
      </p>
    )}
    {error && (
      <p
        id={`${name}-error`}
        className="text-red-500 text-xs mt-1 ml-1"
        role="alert"
      >
        ⚠ {error}
      </p>
    )}
  </div>
);

const CheckboxGroup = ({
  options,
  selected,
  onChange,
  label,
  icon: Icon,
  hint,
  error,
  gridCols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
}) => (
  <div className="mb-6">
    <label className="font-medium text-gray-700 mb-3 flex items-center gap-2">
      <Icon size={18} className="text-gray-600" aria-hidden="true" />
      {label}
    </label>
    {hint && <p className="text-gray-500 text-xs mb-3 ml-1">{hint}</p>}
    <div className={`grid ${gridCols} gap-3`} role="group" aria-label={label}>
      {options.map((option) => {
        const isChecked = selected.includes(option);
        const checkboxId = `checkbox-${label}-${option}`
          .replace(/\s+/g, "-")
          .toLowerCase();

        return (
          <label
            key={option}
            htmlFor={checkboxId}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
              isChecked
                ? "border-navyblue bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              id={checkboxId}
              type="checkbox"
              checked={isChecked}
              onChange={() => onChange(option)}
              className="sr-only"
              aria-checked={isChecked}
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        );
      })}
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-2" role="alert">
        ⚠ {error}
      </p>
    )}
  </div>
);

const DynamicArrayField = ({
  items,
  onChange,
  label,
  icon: Icon,
  hint,
  error,
  errors = {},
  placeholder,
  type = "input",
}) => {
  const handleItemChange = useCallback(
    (index, value) => {
      const newItems = [...items];
      newItems[index] = value;
      onChange(newItems);
    },
    [items, onChange]
  );

  const handleRemove = useCallback(
    (index) => {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
    },
    [items, onChange]
  );

  const handleAdd = useCallback(() => {
    onChange([...items, ""]);
  }, [items, onChange]);

  return (
    <div className="mb-6">
      <label className="block font-medium text-gray-700 mb-4">
        {label}{" "}
        <span className="text-red-500" aria-label="required">
          *
        </span>
      </label>
      {hint && <p className="text-gray-500 text-xs mb-3 ml-1">{hint}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={index} className="relative flex flex-col gap-1 group">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Icon
                    className="text-gray-400"
                    size={18}
                    aria-hidden="true"
                  />
                </div>

                {type === "select" ? (
                  <Select
                    value={item}
                    onValueChange={(value) => handleItemChange(index, value)}
                  >
                    <SelectTrigger
                      className={`w-full p-6 pl-10 h-14 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                        errors[index]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-navyblue focus:border-navyblue"
                      }`}
                      aria-label={`${label} ${index + 1}`}
                      aria-invalid={!!errors[index]}
                    >
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder={`${placeholder} ${index + 1}`}
                    aria-label={`${label} ${index + 1}`}
                    aria-invalid={!!errors[index]}
                    className={`pl-10 pr-10 text-sm w-full py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navyblue focus:border-transparent ${getErrorClass(
                      !!errors[index]
                    )} bg-white`}
                  />
                )}

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    aria-label={`Remove ${label} ${index + 1}`}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1 rounded-full hover:bg-red-50 z-10"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {errors[index] && (
              <p className="text-xs text-red-500 ml-1" role="alert">
                ⚠ {errors[index]}
              </p>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={handleAdd}
        variant="secondary"
        className="mt-4"
        aria-label={`Add another ${label}`}
      >
        <Plus size={16} />
        Add another {label.toLowerCase()}
      </Button>

      {error && (
        <p className="text-xs text-red-500 mt-2" role="alert">
          ⚠ {error}
        </p>
      )}
    </div>
  );
};

const StepOne = ({
  formData = DEFAULT_FORM_DATA,
  setFormData = () => {},
  errors = {},
}) => {
  const safeFormData = useMemo(
    () => ({
      ...DEFAULT_FORM_DATA,
      ...formData,
      address: {
        ...DEFAULT_FORM_DATA.address,
        ...(formData?.address || {}),
      },
      mainCategory:
        formData?.mainCategory?.length > 0 ? formData.mainCategory : [""],
      mainProduct:
        formData?.mainProduct?.length > 0 ? formData.mainProduct : [""],
    }),
    [formData]
  );

  const yearOptions = useMemo(
    () => generateYearOptions(YEAR_RANGE, CURRENT_YEAR),
    []
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setFormData]
  );

  const handleAddressChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        address: { ...(prev.address || {}), [name]: value },
      }));
    },
    [setFormData]
  );

  const handleCheckboxGroupChange = useCallback(
    (field, value) => {
      setFormData((prev) => {
        const current = prev[field] || [];
        const updated = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        return { ...prev, [field]: updated };
      });
    },
    [setFormData]
  );

  const handleArrayFieldChange = useCallback(
    (field, newArray) => {
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    },
    [setFormData]
  );

  const categoryErrors = useMemo(
    () => extractFieldErrors(errors, "mainCategory."),
    [errors]
  );

  const productErrors = useMemo(
    () => extractFieldErrors(errors, "mainProduct."),
    [errors]
  );

  return (
    <div className="max-w-full mx-auto rounded-2xl">
      <div className="flex flex-col gap-6 md:gap-8">
        {/* Basic Information Card */}
        <section
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm"
          aria-labelledby="basic-info-heading"
        >
          <h3
            id="basic-info-heading"
            className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-5 flex items-center gap-2"
          >
            <Building className="text-navyblue" size={22} aria-hidden="true" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              name="companyName"
              value={safeFormData.companyName}
              onChange={handleChange}
              label="Company name"
              icon={User}
              error={errors.companyName}
              hint="Enter your registered business or trading name."
              required
            />

            {/* ✅ NEW: Company Registration Number */}
            <FormField
              name="company_registration_number"
              value={safeFormData.company_registration_number}
              onChange={handleChange}
              label="Company Registration Number"
              icon={FileText}
              error={errors.company_registration_number}
              hint="Enter your VAT, SIRET, BCE, or RC number."
              required
            />

            <FormField
              name="legalowner"
              value={safeFormData.legalowner}
              onChange={handleChange}
              label="Legal owner"
              icon={User}
              error={errors.legalowner}
              hint="Mention the full legal name of the company's owner or director."
              required
            />

            <FormField
              name="locationOfRegistration"
              value={safeFormData.locationOfRegistration}
              onChange={handleChange}
              label="Location of registration"
              icon={MapPin}
              error={errors.locationOfRegistration}
              hint="Enter the city or country where your business is officially registered."
              required
            />

            {/* Registration Year Select */}
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Calendar
                    className="text-gray-400"
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <Select
                  value={safeFormData.companyRegistrationYear}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "companyRegistrationYear", value },
                    })
                  }
                >
                  <SelectTrigger
                    className={`text-sm w-full pl-10 pr-4 py-5.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navyblue focus:border-transparent ${getErrorClass(
                      !!errors.companyRegistrationYear
                    )} bg-white`}
                    aria-label="Year Company Registered"
                    aria-required="true"
                    aria-invalid={!!errors.companyRegistrationYear}
                  >
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600 pointer-events-none z-10">
                  Year Company Registered{" "}
                  <span className="text-red-500" aria-label="required">
                    *
                  </span>
                </label>
              </div>

              <p className="text-gray-500 text-xs mt-1 ml-1">
                Select the year when your business was legally registered.
              </p>

              {errors.companyRegistrationYear && (
                <p className="text-red-500 text-xs mt-1 ml-1" role="alert">
                  ⚠ {errors.companyRegistrationYear}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Address Card */}
        <section
          className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
          aria-labelledby="address-heading"
        >
          <h3
            id="address-heading"
            className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2"
          >
            <MapPin className="text-navyblue" size={22} aria-hidden="true" />
            Company Operational Address{" "}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </h3>

          <div className="mb-4 md:mb-6">
            <CountryStateSelect
              formData={safeFormData}
              setFormData={setFormData}
              errors={errors}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              name="street"
              value={safeFormData.address.street || ""}
              onChange={handleAddressChange}
              label="Street Address"
              icon={MapPin}
              error={errors["address.street"]}
              hint="Enter building number, area, or road name."
              placeholder="Enter street address"
              required
            />

            <FormField
              name="city"
              value={safeFormData.address.city || ""}
              onChange={handleAddressChange}
              label="City"
              icon={MapPin}
              error={errors["address.city"]}
              hint="Enter the city where your company operates."
              placeholder="Enter city"
              required
            />

            <FormField
              name="postalCode"
              value={safeFormData.address.postalCode || ""}
              onChange={handleAddressChange}
              label="Postal Code"
              icon={MapPin}
              error={errors["address.postalCode"]}
              hint="Enter your area's ZIP or postal code."
              placeholder="Enter postal code"
              required
            />
          </div>
        </section>

        {/* Products Card */}
        <section
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm"
          aria-labelledby="products-heading"
        >
          <h3
            id="products-heading"
            className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-5 flex items-center gap-2"
          >
            <Layers className="text-navyblue" size={22} aria-hidden="true" />
            Products & Categories
          </h3>

          <DynamicArrayField
            items={safeFormData.mainCategory}
            onChange={(items) => handleArrayFieldChange("mainCategory", items)}
            label="Main Categories"
            icon={Layers}
            hint="Select the product categories that best describe your company offerings."
            error={errors.mainCategory}
            errors={categoryErrors}
            type="select"
          />

          <DynamicArrayField
            items={safeFormData.mainProduct}
            onChange={(items) => handleArrayFieldChange("mainProduct", items)}
            label="Main Products"
            icon={Building}
            hint="Enter your top-selling or key products relevant to your category. eg( natural stone - marble, ceramic & tiles - ceramic)."
            error={errors.mainProduct}
            errors={productErrors}
            placeholder="Product"
            type="input"
          />
        </section>

        {/* Company Overview */}
        <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-5 flex items-center gap-2">
            <Building className="text-navyblue" size={22} />
            Company Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              name="totalEmployees"
              value={safeFormData.totalEmployees}
              onChange={handleChange}
              label="Total Employees"
              icon={User}
              type="number"
              placeholder="e.g. 120"
            />

            <div className="flex flex-col">
              <Select
                value={safeFormData.businessType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, businessType: value }))
                }
              >
                <SelectTrigger className="h-14">
                  <SelectValue placeholder="Select Business Type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label className="text-xs mt-1 text-gray-600">
                Business Type
              </label>
            </div>
          </div>
        </section>

        {/* Production Capacity */}
        <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-5 flex items-center gap-2">
            <Layers className="text-navyblue" size={22} />
            Production Capacity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              name="factorySize"
              value={safeFormData.factorySize}
              onChange={handleChange}
              label="Factory Size"
              icon={Building}
              placeholder="e.g. 10,000 sq ft"
            />

            <FormField
              name="factoryCountryOrRegion"
              value={safeFormData.factoryCountryOrRegion}
              onChange={handleChange}
              label="Factory Country / Region"
              icon={MapPin}
            />

            <FormField
              name="numberOfProductionLines"
              value={safeFormData.numberOfProductionLines}
              onChange={handleChange}
              label="No. of Production Lines"
              icon={Layers}
              type="number"
            />

            <FormField
              name="annualOutputValue"
              value={safeFormData.annualOutputValue}
              onChange={handleChange}
              label="Annual Output Value"
              icon={DollarSign}
              placeholder="e.g. $5M - $10M"
            />
          </div>

          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={safeFormData.contractManufacturing}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contractManufacturing: e.target.checked,
                }))
              }
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">
              Contract Manufacturing Available
            </span>
          </label>
        </section>

        {/* R&D */}
        <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-5 flex items-center gap-2">
            <User className="text-navyblue" size={22} />
            Research & Development
          </h3>

          <FormField
            name="rdTeamSize"
            value={safeFormData.rdTeamSize}
            onChange={handleChange}
            label="R&D Team Size"
            icon={User}
            type="number"
          />
        </section>

        {/* Trade Capabilities */}
        <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-5 flex items-center gap-2">
            <Globe className="text-navyblue" size={22} />
            Trade Capabilities
          </h3>

          <CheckboxGroup
            options={TRADE_CAPABILITIES}
            selected={safeFormData.tradeCapabilities}
            onChange={(value) =>
              handleCheckboxGroupChange("tradeCapabilities", value)
            }
            label="Trade Capabilities"
            icon={Globe}
            hint="Select all trade services your company provides."
          />
        </section>

        {/* Payment & Communication */}
        <section
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm"
          aria-labelledby="payment-heading"
        >
          <h3
            id="payment-heading"
            className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-5 flex items-center gap-2"
          >
            <CreditCard
              className="text-navyblue"
              size={22}
              aria-hidden="true"
            />
            Payment & Communication
          </h3>

          <CheckboxGroup
            options={CURRENCIES}
            selected={safeFormData.acceptedCurrency}
            onChange={(value) =>
              handleCheckboxGroupChange("acceptedCurrency", value)
            }
            label="Accepted Currencies"
            icon={DollarSign}
            hint="Select currencies you accept for trade or transactions."
            error={errors.acceptedCurrency}
            gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          />

          <CheckboxGroup
            options={PAYMENT_TYPES}
            selected={safeFormData.acceptedPaymentType}
            onChange={(value) =>
              handleCheckboxGroupChange("acceptedPaymentType", value)
            }
            label="Accepted Payment Types"
            icon={CreditCard}
            hint="Choose all payment methods your company supports."
            error={errors.acceptedPaymentType}
          />

          <CheckboxGroup
            options={LANGUAGES}
            selected={safeFormData.languageSpoken}
            onChange={(value) =>
              handleCheckboxGroupChange("languageSpoken", value)
            }
            label="Languages Spoken"
            icon={Globe}
            hint="Select the languages your team can communicate in."
            error={errors.languageSpoken}
          />
        </section>
      </div>
    </div>
  );
};

export default StepOne;
