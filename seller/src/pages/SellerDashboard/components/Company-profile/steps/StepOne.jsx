import React from "react";

const currencies = ["USD","EUR","JPY","CAD","AUD","HKD","GBP","CNY","CHF"];
const paymentTypes = ["T/T","L/C","D/P D/A","MoneyGram","Credit Card","PayPal","Western Union","Cash","Escrow"];
const languages = ["English","Chinese","Spanish","Japanese","Portuguese","German","Arabic","French","Russian","Korean","Hindi","Italian"];

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
      const updated = current.includes(value) ? current.filter((i) => i !== value) : [...current, value];
      return { ...prev, [field]: updated };
    });
  };


  const inputClass = (hasErr) => `w-full px-3 py-2 border rounded ${hasErr ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Basic Company Details</h3>

      <div>
        <label className="block mb-1">Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={inputClass(Boolean(errors.companyName))}
        />
        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
      </div>

      <div>
        <label className="block mb-1">Location of Registration</label>
        <input
          type="text"
          name="locationOfRegistration"
          value={formData.locationOfRegistration}
          onChange={handleChange}
          className={inputClass(Boolean(errors.locationOfRegistration))}
        />
        {errors.locationOfRegistration && <p className="text-red-500 text-sm mt-1">{errors.locationOfRegistration}</p>}
      </div>

      <h4 className="font-medium">Address</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["street","city","stateOrProvince","countryOrRegion","postalCode"].map((field) => {
          const key = `address.${field}`;
          return (
            <div key={field}>
              <label className="block mb-1">{field.replace(/([A-Z])/g, " $1")}</label>
              <input
                type="text"
                name={field}
                value={formData.address?.[field] || ""}
                onChange={handleAddressChange}
                className={inputClass(Boolean(errors[key]))}
              />
              {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
            </div>
          );
        })}
      </div>

      <div>
        <label className="block mb-1">Main Category</label>
        <select
          name="mainCategory"
          value={formData.mainCategory}
          onChange={handleChange}
          className={inputClass(Boolean(errors.mainCategory))}
        >
          <option value="">Select</option>
          <option value="Marble">Marble</option>
          <option value="Granite">Granite</option>
        </select>
        {errors.mainCategory && <p className="text-red-500 text-sm mt-1">{errors.mainCategory}</p>}
      </div>

      <div>
        <label className="block mb-1">Sub Category</label>
        <input
          type="text"
          name="subCategory"
          value={formData.subCategory}
          onChange={handleChange}
          className={inputClass(Boolean(errors.subCategory))}
        />
        {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
      </div>

      <div>
        <label className="block mb-1">Accepted Currencies</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {currencies.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.acceptedCurrency || []).includes(c)}
                onChange={() => handleCheckboxGroupChange("acceptedCurrency", c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
        {errors.acceptedCurrency && <p className="text-red-500 text-sm mt-1">{errors.acceptedCurrency}</p>}
      </div>

      <div>
        <label className="block mb-1">Accepted Payment Types</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {paymentTypes.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.acceptedPaymentType || []).includes(c)}
                onChange={() => handleCheckboxGroupChange("acceptedPaymentType", c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
        {errors.acceptedPaymentType && <p className="text-red-500 text-sm mt-1">{errors.acceptedPaymentType}</p>}
      </div>

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
        {errors.languageSpoken && <p className="text-red-500 text-sm mt-1">{errors.languageSpoken}</p>}
      </div>
    </div>
  );
}
