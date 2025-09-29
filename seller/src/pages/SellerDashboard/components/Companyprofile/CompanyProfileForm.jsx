import React, { useEffect, useState } from "react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import ReviewStep from "./steps/ReviewStep";
import { ZodError } from "zod";
import { stepOneSchema, stepTwoSchema } from "./utils/validation";

const steps = [
  { id: 1, title: "Basic Details", component: StepOne, schema: stepOneSchema },
  { id: 2, title: "Introduction", component: StepTwo, schema: stepTwoSchema },
  { id: 3, title: "Review & Submit", component: ReviewStep, schema: null },
];

export default function CompanyProfileForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    companyName: "",
    legalowner: "",
    locationOfRegistration: "",
    companyRegistrationYear: "",
    address: {
      street: "",
      city: "",
      stateOrProvince: "",
      countryOrRegion: "",
      postalCode: "",
    },
    mainCategory: "",
    mainProduct: [],
    acceptedCurrency: [],
    acceptedPaymentType: [],
    languageSpoken: [],

    // Step 2
    companyDescription: "",
    logo: null,
    companyPhotos: [],
    companyVideos: [],
  });

  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.round(((currentStep - 1) / (steps.length - 1)) * 100));
  }, [currentStep]);

  const CurrentComponent = steps[currentStep - 1].component;

  const mapZodErrors = (zErr) => {
    const formatted = {};
    if (zErr?.issues && Array.isArray(zErr.issues)) {
      zErr.issues.forEach((e) => {
        const path = Array.isArray(e.path)
          ? e.path.join(".")
          : String(e.path || "");
        if (!formatted[path]) {
          formatted[path] = e.message;
        }
      });
    }
    return formatted;
  };

  const nextStep = async () => {
    const schema = steps[currentStep - 1].schema;
    if (!schema) {
      setCurrentStep((s) => s + 1);
      return;
    }
    try {
      await schema.parseAsync(formData);
      setErrors({});
      setCurrentStep((s) => s + 1);
    } catch (err) {
      const formatted = mapZodErrors(err);
      setErrors(formatted);
    }
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    try {
      await stepOneSchema.parseAsync(formData);
      await stepTwoSchema.parseAsync(formData);
      setErrors({});
      console.log("Final Submission", formData);
      alert("Submitted ✅ (check console)");
    } catch (err) {
      const formatted = mapZodErrors(err);
      setErrors(formatted);
      // jump to first failing step
      if (
        formatted["companyName"] ||
        formatted["address.street"] ||
        formatted["acceptedCurrency"]
      ) {
        setCurrentStep(1);
      } else if (
        formatted["companyDescription"] ||
        formatted["logo"] ||
        formatted["companyPhotos"]
      ) {
        setCurrentStep(2);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto rounded">
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Progress</span>
          <span className="text-sm">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-navyblue rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        <CurrentComponent
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

        <div className="mt-6 flex gap-2 justify-between items-center">
          <div>
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Back
              </button>
            )}
          </div>

          <div className="ml-auto flex gap-2">
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-navyblue text-white rounded cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
