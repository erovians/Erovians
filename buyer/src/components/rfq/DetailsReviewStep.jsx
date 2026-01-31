import React from "react";
import {
  Package,
  DollarSign,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Edit2,
} from "lucide-react";
import { Country, State, City } from "country-state-city";

const units = ["sq.ft", "sq.m", "piece", "ton", "kg", "running meter"];

const timelines = [
  "Within 1 week",
  "Within 2 weeks",
  "Within 1 month",
  "1-3 months",
  "3+ months",
  "Flexible",
];

const DetailsReviewStep = ({
  currentStep,
  formData,
  setFormData,
  errors,
  uploadedFiles,
  setCurrentStep,
  isAuthenticated,
  logedUser,
  hasShippingAddress,
}) => {
  const countries = Country.getAllCountries();
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);

  // Handle country change (not logged in)
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setFormData({
      ...formData,
      country: countryCode,
      state: "",
      city: "",
      location: "",
    });
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]);
  };

  // Handle state change (not logged in)
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setFormData({ ...formData, state: stateCode, city: "", location: "" });
    setCities(City.getCitiesOfState(formData.country, stateCode));
  };

  // Handle city change (not logged in) — build location string
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const countryName =
      countries.find((c) => c.isoCode === formData.country)?.name || "";
    const stateName =
      states.find((s) => s.isoCode === formData.state)?.name || "";
    const location = `${cityName}, ${stateName}, ${countryName}`;

    setFormData({ ...formData, city: cityName, location });
  };

  // Handle shipping address change (logged in)
  const handleShippingAddressChange = (e) => {
    const index = parseInt(e.target.value);
    const selected = logedUser?.shipping_address?.[index] || null;
    setFormData({ ...formData, selectedShippingAddress: selected });
  };

  // Step 3 - Project Details
  if (currentStep === 3) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Project Details
          </h2>
          <p className="text-xs text-gray-600">
            Help sellers provide accurate quotations
          </p>
        </div>

        {/* Quantity */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-900 mb-1.5">
              <Package className="w-3 h-3 inline mr-1" />
              Quantity Required *
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="Enter quantity"
              className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none ${
                errors.quantity
                  ? "border-red-500"
                  : "border-gray-300 focus:border-navyblue"
              }`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-1.5">
              Unit
            </label>
            <select
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-navyblue focus:outline-none bg-white"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-900 mb-1.5">
            <DollarSign className="w-3 h-3 inline mr-1" />
            Budget Range (Optional)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min="0"
              value={formData.budgetMin}
              onChange={(e) =>
                setFormData({ ...formData, budgetMin: e.target.value })
              }
              placeholder="Min budget (₹)"
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-navyblue focus:outline-none"
            />
            <input
              type="number"
              min="0"
              value={formData.budgetMax}
              onChange={(e) =>
                setFormData({ ...formData, budgetMax: e.target.value })
              }
              placeholder="Max budget (₹)"
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-navyblue focus:outline-none"
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Providing budget helps sellers give relevant quotes
          </p>
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-xs font-semibold text-gray-900 mb-1.5">
            <Calendar className="w-3 h-3 inline mr-1" />
            Expected Timeline *
          </label>
          <select
            value={formData.timeline}
            onChange={(e) =>
              setFormData({ ...formData, timeline: e.target.value })
            }
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none bg-white ${
              errors.timeline
                ? "border-red-500"
                : "border-gray-300 focus:border-navyblue"
            }`}
          >
            <option value="">Select timeline</option>
            {timelines.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.timeline && (
            <p className="text-red-500 text-xs mt-1">{errors.timeline}</p>
          )}
        </div>

        {/* ========== LOCATION ========== */}
        <div>
          <label className="block text-xs font-semibold text-gray-900 mb-1.5">
            <MapPin className="w-3 h-3 inline mr-1" />
            Delivery Location *
          </label>

          {/* Logged in + has shipping addresses */}
          {hasShippingAddress ? (
            <div>
              <select
                value={
                  logedUser.shipping_address.findIndex(
                    (addr) => addr._id === formData.selectedShippingAddress?._id
                  ) !== -1
                    ? logedUser.shipping_address.findIndex(
                        (addr) =>
                          addr._id === formData.selectedShippingAddress?._id
                      )
                    : 0
                }
                onChange={handleShippingAddressChange}
                className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none bg-white ${
                  errors.location
                    ? "border-red-500"
                    : "border-gray-300 focus:border-navyblue"
                }`}
              >
                {logedUser.shipping_address.map((addr, index) => (
                  <option key={addr._id} value={index}>
                    {addr.name} — {addr.city}, {addr.state}
                  </option>
                ))}
              </select>

              {/* Selected address details */}
              {formData.selectedShippingAddress && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">
                      {formData.selectedShippingAddress.name}
                    </span>{" "}
                    — {formData.selectedShippingAddress.landmark},{" "}
                    {formData.selectedShippingAddress.city},{" "}
                    {formData.selectedShippingAddress.state},{" "}
                    {formData.selectedShippingAddress.country} -{" "}
                    {formData.selectedShippingAddress.pincode}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Not logged in OR logged in but no shipping address — manual selection
            <div className="grid grid-cols-3 gap-3">
              {/* Country */}
              <div>
                <select
                  value={formData.country}
                  onChange={handleCountryChange}
                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none bg-white ${
                    errors.location && !formData.country
                      ? "border-red-500"
                      : "border-gray-300 focus:border-navyblue"
                  }`}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <select
                  value={formData.state}
                  onChange={handleStateChange}
                  disabled={!formData.country}
                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none bg-white disabled:bg-gray-100 ${
                    errors.location && formData.country && !formData.state
                      ? "border-red-500"
                      : "border-gray-300 focus:border-navyblue"
                  }`}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <select
                  value={formData.city}
                  onChange={handleCityChange}
                  disabled={!formData.state}
                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none bg-white disabled:bg-gray-100 ${
                    errors.location &&
                    formData.country &&
                    formData.state &&
                    !formData.city
                      ? "border-red-500"
                      : "border-gray-300 focus:border-navyblue"
                  }`}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>
      </div>
    );
  }

  // ========== Step 4 - Review & Submit ==========
  // Build location display string for review
  let locationDisplay = "";
  if (hasShippingAddress && formData.selectedShippingAddress) {
    const addr = formData.selectedShippingAddress;
    locationDisplay = `${addr.city}, ${addr.state}, ${addr.country}`;
  } else {
    locationDisplay = formData.location || "";
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Review Your Request
        </h2>
        <p className="text-xs text-gray-600">
          Please verify all information before submitting
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-3">
        {/* Category */}
        <div className="border-2 border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">Category</h3>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-navyblue hover:underline text-xs flex items-center gap-1"
            >
              <Edit2 size={12} />
              Edit
            </button>
          </div>
          <p className="text-xs text-gray-700">{formData.categoryName}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {formData.subcategories.map((sub) => (
              <span
                key={sub}
                className="bg-lightblue text-navyblue px-2 py-0.5 rounded-full text-[10px] font-semibold"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="border-2 border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              Requirements
            </h3>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-navyblue hover:underline text-xs flex items-center gap-1"
            >
              <Edit2 size={12} />
              Edit
            </button>
          </div>
          <p className="text-xs text-gray-700 whitespace-pre-line line-clamp-3">
            {formData.requirements}
          </p>
          {formData.specifications && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-[10px] font-semibold text-gray-600 mb-0.5">
                Additional Specifications:
              </p>
              <p className="text-xs text-gray-700 whitespace-pre-line line-clamp-2">
                {formData.specifications}
              </p>
            </div>
          )}
          {uploadedFiles.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-[10px] font-semibold text-gray-600 mb-1">
                Attached Files: {uploadedFiles.length}
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-30"
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="border-2 border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              Project Details
            </h3>
            <button
              onClick={() => setCurrentStep(3)}
              className="text-navyblue hover:underline text-xs flex items-center gap-1"
            >
              <Edit2 size={12} />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-600 text-[10px]">Quantity</p>
              <p className="font-semibold text-gray-900">
                {formData.quantity} {formData.unit}
              </p>
            </div>
            {(formData.budgetMin || formData.budgetMax) && (
              <div>
                <p className="text-gray-600 text-[10px]">Budget Range</p>
                <p className="font-semibold text-gray-900">
                  ₹{formData.budgetMin || "0"} - ₹
                  {formData.budgetMax || "Not specified"}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-600 text-[10px]">Timeline</p>
              <p className="font-semibold text-gray-900">{formData.timeline}</p>
            </div>
            <div>
              <p className="text-gray-600 text-[10px]">Location</p>
              <p className="font-semibold text-gray-900">{locationDisplay}</p>
            </div>
          </div>
        </div>

        {/* ========== CONTACT INFO ========== */}
        {/* Only show if NOT logged in */}
        {!isAuthenticated && (
          <div className="border-2 border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  <Mail className="w-3 h-3 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactEmail: e.target.value,
                    })
                  }
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:border-navyblue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  <Phone className="w-3 h-3 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPhone: e.target.value,
                    })
                  }
                  placeholder="+91-XXXXXXXXXX"
                  className="w-full px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:border-navyblue focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>💡 What happens next?</strong>
          <br />
          Your RFQ will be sent to all relevant sellers in the selected
          categories. Sellers will review your requirements and send customized
          quotations within 24-48 hours. You can compare quotes and choose the
          best offer.
        </p>
      </div>
    </div>
  );
};

export default DetailsReviewStep;
