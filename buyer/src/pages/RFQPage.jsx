import React, { useState } from "react";
import Layout from "../components/common/Layout";
import { FileText, ChevronRight, ChevronLeft, Check, Send } from "lucide-react";
import CategoryStep from "../components/rfq/CategoryStep";
import RequirementsStep from "../components/rfq/RequirementsStep";
import DetailsReviewStep from "../components/rfq/DetailsReviewStep";

const RFQPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    categoryName: "",
    subcategories: [],
    requirements: "",
    specifications: "",
    quantity: "",
    unit: "sq.ft",
    budgetMin: "",
    budgetMax: "",
    timeline: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const totalSteps = 4;

  // Validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.category) newErrors.category = "Please select a category";
      if (formData.subcategories.length === 0)
        newErrors.subcategories = "Please select at least one subcategory";
    }

    if (step === 2) {
      if (!formData.requirements.trim())
        newErrors.requirements = "Please describe your requirements";
    }

    if (step === 3) {
      if (!formData.quantity) newErrors.quantity = "Please enter quantity";
      if (!formData.timeline) newErrors.timeline = "Please select timeline";
      if (!formData.location.trim())
        newErrors.location = "Please enter location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // TODO: Backend integration
    console.log("RFQ Submitted:", { ...formData, files: uploadedFiles });
    alert(
      "Your RFQ has been submitted! Sellers will respond with quotations soon."
    );
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-4">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-navyblue rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Request for Quotation
                </h1>
                <p className="text-xs text-gray-600">
                  Tell us what you need and get quotes from multiple sellers
                </p>
              </div>
            </div>

            {/* Progress Bar - Redesigned */}
            {/* Progress Bar - Mobile Responsive */}
            <div className="mt-5 px-1 sm:px-2">
              <div className="relative">
                {/* Background Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>

                {/* Active Line */}
                <div
                  className="absolute top-5 left-0 h-0.5 bg-linear-to-r from-navyblue to-green-500 transition-all duration-500 ease-in-out"
                  style={{
                    width: `${((currentStep - 1) / 3) * 100}%`,
                  }}
                ></div>

                {/* Steps */}
                <div className="relative flex justify-between items-start">
                  {[
                    { num: 1, label: "Category", desc: "Select type" },
                    { num: 2, label: "Requirements", desc: "Add details" },
                    { num: 3, label: "Details", desc: "Specifications" },
                    { num: 4, label: "Review", desc: "Confirm & submit" },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className="flex flex-col items-center flex-1"
                    >
                      {/* Circle - same as before */}
                      <div className="relative">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg relative z-10 ${
                            currentStep > step.num
                              ? "bg-linear-to-br from-green-400 to-green-600 text-white scale-110"
                              : currentStep === step.num
                              ? "bg-linear-to-br from-navyblue to-blue-700 text-white scale-110 ring-4 ring-blue-100"
                              : "bg-white text-gray-400 border-2 border-gray-300"
                          }`}
                        >
                          {currentStep > step.num ? (
                            <Check
                              size={16}
                              strokeWidth={3}
                              className="sm:w-4.5 sm:h-4.5"
                            />
                          ) : (
                            step.num
                          )}
                        </div>

                        {currentStep === step.num && (
                          <div className="absolute inset-0 rounded-full bg-navyblue opacity-20 animate-ping"></div>
                        )}
                      </div>

                      {/* Label */}
                      <div className="mt-2 sm:mt-3 text-center max-w-17.5 sm:max-w-none">
                        <p
                          className={`text-[10px] sm:text-xs font-semibold transition-colors duration-300 ${
                            currentStep >= step.num
                              ? "text-navyblue"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p
                          className={`text-[8px] sm:text-[9px] mt-0.5 transition-colors duration-300 hidden sm:block ${
                            currentStep >= step.num
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            {currentStep === 1 && (
              <CategoryStep
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
            )}

            {currentStep === 2 && (
              <RequirementsStep
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
              />
            )}

            {(currentStep === 3 || currentStep === 4) && (
              <DetailsReviewStep
                currentStep={currentStep}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                uploadedFiles={uploadedFiles}
                setCurrentStep={setCurrentStep}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-4">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-navyblue text-white rounded-lg font-semibold hover:bg-blue transition-colors shadow-sm text-sm"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-yellow-500 text-navyblue rounded-lg font-semibold hover:bg-yellow-400 transition-colors shadow-sm text-sm"
              >
                <Send size={18} />
                Submit RFQ
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RFQPage;
