import React from "react";

const Step3 = ({
  formData,
  errors,
  loading,
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
          className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
          rows={3}
        />
        {errors.seller_address && (
          <p className="text-red-500 text-sm mt-1">{errors.seller_address}</p>
        )}
      </div>

      {/* Seller Country - COMMON */}
      <div>
        <input
          type="text"
          name="seller_country"
          placeholder="Country *"
          value={formData.seller_country}
          onChange={onFormChange}
          className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
        />
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
          className="text-gray-500 font-semibold hover:text-gray-700"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded-md font-bold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0c2c43] hover:bg-[#1a4361]"
          } text-white`}
        >
          {loading ? "Submitting..." : "Submit & Register"}
        </button>
      </div>
    </form>
  );
};

export default Step3;
