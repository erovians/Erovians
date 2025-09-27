import React from "react";
import { User, MapPin, Building, Layers, XIcon } from "lucide-react";

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

export default function StepOne({ formData, setFormData, errors }) {
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
    `w-full px-3 py-2 border rounded  ${
      hasErr ? "border-red-500" : "border-gray-300"
    }`;

  const wrapperClass = "flex items-center gap-2 w-full max-w-md";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Basic Company Details</h3>

      {/* Company Name */}
      <div className={wrapperClass}>
        <User className="text-gray-400" />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          className={inputClass(Boolean(errors.companyName))}
        />
      </div>
      {errors.companyName && (
        <p className="text-red-500 text-sm -mt-4 ">{errors.companyName}</p>
      )}

      {/* Location of Registration */}
      <div className={wrapperClass}>
        <MapPin className="text-gray-400" />
        <input
          type="text"
          name="locationOfRegistration"
          placeholder="Location of Registration"
          value={formData.locationOfRegistration}
          onChange={handleChange}
          className={inputClass(Boolean(errors.locationOfRegistration))}
        />
      </div>
      {errors.locationOfRegistration && (
        <p className="text-red-500 text-sm -mt-4 ">
          {errors.locationOfRegistration}
        </p>
      )}

      <h4 className="font-medium">
        <span className="text-red-400">*</span> Company Operational Address
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "street",
          "city",
          "state/ Province",
          "country/Region",
          "zipcode/ postalCode",
        ].map((field) => {
          const errorKey = `address.${field}`;
          return (
            <div key={field} className="flex flex-col w-full max-w-md">
              {/* Icon + Input row */}
              <div className="flex items-center gap-2 w-full">
                <MapPin className="text-gray-400" />
                <input
                  type="text"
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={formData.address?.[field] || ""}
                  onChange={handleAddressChange}
                  className={inputClass(Boolean(errors[errorKey]))}
                />
              </div>

              {/* Error message */}
              {errors[errorKey] && (
                <p className="text-red-500 text-sm mt-1">{errors[errorKey]}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Category */}
      <div className={wrapperClass}>
        <Layers className="text-gray-400" />
        <span className="text-red-400">*</span>
        <select
          name="mainCategory"
          value={formData.mainCategory}
          onChange={handleChange}
          className={inputClass(Boolean(errors.mainCategory))}
        >
          <option value="">Select Main Category</option>
          <option value="Marble">Marble</option>
          <option value="Granite">Granite</option>
        </select>
      </div>
      {errors.mainCategory && (
        <p className="text-red-500 text-sm -mt-4 ">{errors.mainCategory}</p>
      )}

      {/* Sub Category */}
      {/* <div className={wrapperClass}>
        <Building className="text-gray-400" />
        <input
          type="text"
          name="subCategory"
          placeholder="Sub Category"
          value={formData.subCategory}
          onChange={handleChange}
          className={inputClass(Boolean(errors.subCategory))}
        />
      </div>
      {errors.subCategory && (
        <p className="text-red-500 text-sm -mt-4 ">{errors.subCategory}</p>
      )} */}
      {/* Sub Categories (Multiple Inputs) */}
      <div className="space-y-6">
        <label className="block font-medium">
          <span className="text-red-400">*</span> Main Products
        </label>

        {/* Responsive grid for product inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 ">
          {(formData.mainProduct.length > 0 ? formData.mainProduct : [""]).map(
            (sub, index) => (
              <div key={index} className="flex items-center gap-2 w-x">
                <Building className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  name={`mainProduct-${index}`}
                  placeholder={`Product ${index + 1}`}
                  value={sub}
                  onChange={(e) => {
                    const newSubs = [...formData.mainProduct];
                    newSubs[index] = e.target.value;
                    setFormData((prev) => ({ ...prev, mainProduct: newSubs }));
                  }}
                  className={`flex-1 text-base ${inputClass(
                    Boolean(errors.mainProduct)
                  )}`}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newSubs = formData.mainProduct.filter(
                        (_, i) => i !== index
                      );
                      setFormData((prev) => ({
                        ...prev,
                        mainProduct: newSubs,
                      }));
                    }}
                    className="flex-shrink-0"
                  >
                    <XIcon size={20} className="text-red-500" />
                  </button>
                )}
              </div>
            )
          )}
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              mainProduct: [...prev.mainProduct, ""],
            }))
          }
          className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded"
        >
          + Add Another Product
        </button>

        {errors.mainProduct && (
          <p className="text-red-500 text-sm -mt-4">{errors.mainProduct}</p>
        )}
      </div>

      {/* Accepted Currencies */}
      <div>
        <label className="block mb-1">Accepted Currencies</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {currencies.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.acceptedCurrency || []).includes(c)}
                onChange={() =>
                  handleCheckboxGroupChange("acceptedCurrency", c)
                }
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
        {errors.acceptedCurrency && (
          <p className="text-red-500 text-sm">{errors.acceptedCurrency}</p>
        )}
      </div>

      {/* Payment Types */}
      <div>
        <label className="block mb-1">Accepted Payment Types</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {paymentTypes.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.acceptedPaymentType || []).includes(c)}
                onChange={() =>
                  handleCheckboxGroupChange("acceptedPaymentType", c)
                }
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
        {errors.acceptedPaymentType && (
          <p className="text-red-500 text-sm">{errors.acceptedPaymentType}</p>
        )}
      </div>

      {/* Languages Spoken */}
      <div>
        <label className="block mb-1">Languages Spoken</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {languages.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.languageSpoken || []).includes(c)}
                onChange={() => handleCheckboxGroupChange("languageSpoken", c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
        {errors.languageSpoken && (
          <p className="text-red-500 text-sm">{errors.languageSpoken}</p>
        )}
      </div>
    </div>
  );
}
