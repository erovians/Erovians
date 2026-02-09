import React from "react";
import ReactCountryFlag from "react-country-flag"; // ✅ Install: npm install react-country-flag

const Step3 = ({
  formData,
  errors,
  isLoadingRegister,
  onFormChange,
  onFileUpload,
  onBack,
  onSubmit,
}) => {
  const isProfessional = formData.seller_status === "professional";

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {/* Seller Status - FIRST */}
      <div>
        <select
          name="seller_status"
          value={formData.seller_status}
          onChange={onFormChange}
          disabled={isLoadingRegister}
          className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
        >
          <option value="">Select Seller Type *</option>
          <option value="individual">Individual Seller</option>
          <option value="professional">Professional / Company</option>
        </select>
        {errors.seller_status && (
          <p className="text-red-500 text-sm mt-1">{errors.seller_status}</p>
        )}
      </div>

      {/* Seller Address - COMMON */}
      <div>
        <textarea
          name="seller_address"
          placeholder="Your Business/Seller Address *"
          value={formData.seller_address}
          onChange={onFormChange}
          disabled={isLoadingRegister}
          className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
          rows={3}
        />
        {errors.seller_address && (
          <p className="text-red-500 text-sm mt-1">{errors.seller_address}</p>
        )}
      </div>

      {/* ✅ UPDATED: Seller Country - DISABLED with FLAG */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Country (Based on verified mobile number)
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <ReactCountryFlag
              countryCode={formData.seller_country || "IN"}
              svg
              style={{
                width: "1.5em",
                height: "1.5em",
              }}
              title={formData.seller_country || "IN"}
            />
          </div>
          <input
            type="text"
            name="seller_country"
            placeholder="Country *"
            value={formData.seller_country}
            disabled={true} // ✅ ALWAYS DISABLED
            className="w-full pl-12 pr-4 py-3 border rounded-md text-sm outline-none bg-gray-50 text-gray-700 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          ℹ️ Country is locked based on your verified mobile number
        </p>
        {errors.seller_country && (
          <p className="text-red-500 text-sm mt-1">{errors.seller_country}</p>
        )}
      </div>

      {/* === PROFESSIONAL ONLY FIELDS === */}
      {isProfessional && (
        <>
          {/* Business Name */}
          <div>
            <input
              type="text"
              name="businessName"
              placeholder="Company/Business Name *"
              value={formData.businessName}
              onChange={onFormChange}
              disabled={isLoadingRegister}
              className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
            />
            {errors.businessName && (
              <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
            )}
          </div>

          {/* Registration Location */}
          <div>
            <input
              type="text"
              name="companyregstartionlocation"
              placeholder="Company Registration Location *"
              value={formData.companyregstartionlocation}
              onChange={onFormChange}
              disabled={isLoadingRegister}
              className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
            />
            {errors.companyregstartionlocation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyregstartionlocation}
              </p>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Company Registration Document (JPG, PNG, PDF) *
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={onFileUpload}
              disabled={isLoadingRegister}
              className="w-full px-4 py-3 border rounded-md text-sm"
            />
            {errors.documentFile && (
              <p className="text-red-500 text-sm mt-1">{errors.documentFile}</p>
            )}
            {formData.documentFile && !errors.documentFile && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {formData.documentFile.name}
              </p>
            )}
          </div>
        </>
      )}

      {/* === INDIVIDUAL ONLY INFO === */}
      {formData.seller_status === "individual" && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            ℹ️ As an individual seller, you can start selling without company
            registration documents.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoadingRegister}
          className={`text-gray-500 font-semibold hover:text-gray-700 ${
            isLoadingRegister ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isLoadingRegister}
          className={`px-6 py-2 rounded-md font-bold transition flex items-center justify-center gap-2 ${
            isLoadingRegister
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0c2c43] hover:bg-[#1a4361]"
          } text-white`}
        >
          {isLoadingRegister && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isLoadingRegister ? "Submitting..." : "Submit & Register"}
        </button>
      </div>
    </form>
  );
};

export default Step3;
