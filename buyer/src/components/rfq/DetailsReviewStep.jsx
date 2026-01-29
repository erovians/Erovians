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
}) => {
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

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-gray-900 mb-1.5">
            <MapPin className="w-3 h-3 inline mr-1" />
            Delivery Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="City, State"
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none ${
              errors.location
                ? "border-red-500"
                : "border-gray-300 focus:border-navyblue"
            }`}
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>
      </div>
    );
  }

  // Step 4 - Review & Submit
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
              <p className="font-semibold text-gray-900">{formData.location}</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
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
