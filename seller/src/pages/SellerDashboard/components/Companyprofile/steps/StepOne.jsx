import React from "react";
import { User, MapPin, Calendar, Building, Layers, X, DollarSign, CreditCard, Globe } from "lucide-react";

const currencies = [
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
const paymentTypes = [
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
const languages = [
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

export default function StepOne({ formData = {
  companyName: "",
  legalowner: "",
  locationOfRegistration: "",
  companyRegistrationYear: "",
  address: {},
  mainCategory: "",
  mainProduct: [""],
  acceptedCurrency: [],
  acceptedPaymentType: [],
  languageSpoken: []
}, setFormData = () => {}, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...(prev.address || {}), [name]: value },
    }));
  };

  const handleCheckboxGroupChange = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter((i) => i !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const inputClass = (hasErr) =>
    `text-sm w-full pl-3 pr-3 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navyblue focus:border-transparent ${
      hasErr ? "border-red-400" : "border-gray-300 bg-white hover:border-gray-400"
    }`;

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg">
      <div className="space-y-8">

        {/* Basic Information Card */}
        <div className="bg-white rounded-xl p-2 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Building className="text-navyblue" size={22} />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder=" "
                  className={`${inputClass(Boolean(errors.companyName))} pl-10 peer`}
                />
                <label
                  className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600 
                     transition-all duration-200 pointer-events-none
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Company name <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <span className="font-medium">⚠</span> {errors.companyName}
                </p>
              )}
            </div>

            {/* Legal Owner */}
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  name="legalowner"
                  value={formData.legalowner}
                  onChange={handleChange}
                  placeholder=" "
                  className={`${inputClass(Boolean(errors.legalowner))} pl-10 peer`}
                />
                <label
                  className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600 
                     transition-all duration-200 pointer-events-none
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Legal owner <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.legalowner && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <span className="font-medium">⚠</span> {errors.legalowner}
                </p>
              )}
            </div>

            {/* Location of Registration */}
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <MapPin className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  name="locationOfRegistration"
                  value={formData.locationOfRegistration}
                  onChange={handleChange}
                  placeholder=" "
                  className={`${inputClass(Boolean(errors.locationOfRegistration))} pl-10 peer`}
                />
                <label
                  className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600 
                     transition-all duration-200 pointer-events-none
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Location of registration <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.locationOfRegistration && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <span className="font-medium">⚠</span> {errors.locationOfRegistration}
                </p>
              )}
            </div>

            {/* Registration Year */}
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar className="text-gray-400" size={20} />
                </div>
                <input
                  type="date"
                  name="companyRegistrationYear"
                  value={formData.companyRegistrationYear}
                  onChange={handleChange}
                  className={`${inputClass(Boolean(errors.companyRegistrationYear))} pl-10`}
                />
                <label
                  className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600"
                >
                  Year Company Registered <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.companyRegistrationYear && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <span className="font-medium">⚠</span> {errors.companyRegistrationYear}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <MapPin className="text-navyblue" size={22} />
            Company Operational Address <span className="text-red-500">*</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { field: "street", label: "Street address" },
              { field: "city", label: "City" },
              { field: "stateOrProvince", label: "State / Province" },
              { field: "countryOrRegion", label: "Country / Region" },
              { field: "postalCode", label: "Postal Code" },
            ].map(({ field, label }) => {
              const errorKey = `address.${field}`;
              return (
                <div key={field} className="flex flex-col">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <MapPin className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      name={field}
                      value={formData.address?.[field] || ""}
                      onChange={handleAddressChange}
                      placeholder=" "
                      className={`${inputClass(Boolean(errors[errorKey]))} pl-10 peer`}
                    />
                    <label
                      className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600 
                         transition-all duration-200 pointer-events-none
                         peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                         peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"
                    >
                      {label}
                    </label>
                  </div>
                  {errors[errorKey] && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                      <span className="font-medium">⚠</span> {errors[errorKey]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Layers className="text-navyblue" size={22} />
            Products & Categories
          </h3>

          {/* Main Category */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <Layers className="text-gray-400" size={20} />
              </div>
              <select
                name="mainCategory"
                value={formData.mainCategory}
                onChange={handleChange}
                className={`${inputClass(Boolean(errors.mainCategory))} pl-10 appearance-none cursor-pointer`}
              >
                <option value="">Select Main Category</option>
                <option value="Marble">Marble</option>
                <option value="Granite">Granite</option>
              </select>
              <label className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600">
                Main Category <span className="text-red-500">*</span>
              </label>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.mainCategory && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.mainCategory}
              </p>
            )}
          </div>

          {/* Main Products */}
          <div>
            <label className="block font-medium text-gray-700 mb-4">
              Main Products <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(formData.mainProduct.length > 0 ? formData.mainProduct : [""]).map((sub, index) => (
                <div key={index} className="relative flex items-center gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Building className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      value={sub}
                      onChange={(e) => {
                        const newSubs = [...formData.mainProduct];
                        newSubs[index] = e.target.value;
                        setFormData((prev) => ({ ...prev, mainProduct: newSubs }));
                      }}
                      placeholder={`Product ${index + 1}`}
                      className={`${inputClass(Boolean(errors.mainProduct))} pl-9 pr-10`}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newSubs = formData.mainProduct.filter((_, i) => i !== index);
                          setFormData((prev) => ({ ...prev, mainProduct: newSubs }));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  mainProduct: [...prev.mainProduct, ""],
                }))
              }
              className="mt-4 px-4 py-2 border border-navyblue text-sm font-medium bg-navyblue text-white rounded-sm hover:bg-white hover:text-navyblue transition-colors shadow-sm cursor-pointer"
            >
              + Add Another Product
            </button>

            {errors.mainProduct && (
              <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.mainProduct}
              </p>
            )}
          </div>
        </div>

        {/* Payment & Languages Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <CreditCard className="text-navyblue" size={22} />
            Payment & Communication
          </h3>

          {/* Accepted Currencies */}
          <div className="mb-6">
            <label className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <DollarSign size={18} className="text-gray-600" />
              Accepted Currencies
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {currencies.map((c) => (
                <label
                  key={c}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    (formData.acceptedCurrency || []).includes(c)
                      ? "border-navyblue bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(formData.acceptedCurrency || []).includes(c)}
                    onChange={() => handleCheckboxGroupChange("acceptedCurrency", c)}
                    className="w-4 h-4 text-navyblue rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">{c}</span>
                </label>
              ))}
            </div>
            {errors.acceptedCurrency && (
              <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.acceptedCurrency}
              </p>
            )}
          </div>

          {/* Payment Types */}
          <div className="mb-6">
            <label className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-600" />
              Accepted Payment Types
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {paymentTypes.map((c) => (
                <label
                  key={c}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    (formData.acceptedPaymentType || []).includes(c)
                      ? "border-navyblue bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(formData.acceptedPaymentType || []).includes(c)}
                    onChange={() => handleCheckboxGroupChange("acceptedPaymentType", c)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">{c}</span>
                </label>
              ))}
            </div>
            {errors.acceptedPaymentType && (
              <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.acceptedPaymentType}
              </p>
            )}
          </div>

          {/* Languages */}
          <div>
            <label className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Globe size={18} className="text-gray-600" />
              Languages Spoken
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {languages.map((c) => (
                <label
                  key={c}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    (formData.languageSpoken || []).includes(c)
                      ? "border-navyblue bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(formData.languageSpoken || []).includes(c)}
                    onChange={() => handleCheckboxGroupChange("languageSpoken", c)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">{c}</span>
                </label>
              ))}
            </div>
            {errors.languageSpoken && (
              <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.languageSpoken}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}