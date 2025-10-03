import React, { useEffect, useState } from "react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import ReviewStep from "./steps/ReviewStep";
import { stepOneSchema, stepTwoSchema } from "./utils/validation";
import api from "@/utils/axios.utils";
import { Loader2, Check, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 1,
    title: "Comapny Basic Details",
    component: StepOne,
    schema: stepOneSchema,
  },
  {
    id: 2,
    title: "Company Introduction",
    component: StepTwo,
    schema: stepTwoSchema,
  },
  { id: 3, title: "Review & Submit", component: ReviewStep, schema: null },
];

export default function CompanyProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("currentStep");
    return savedStep ? Number(savedStep) : 1;
  });
  // const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("companyFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
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
        };
  });

  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const { logo, companyPhotos, companyVideos, ...safeData } = formData;
    localStorage.setItem("companyFormData", JSON.stringify(safeData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
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
    console.log("Validation errors:", formatted);
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

  // const handleSubmit = async () => {
  //   try {
  //     console.log("Submitting form data...");
  //     await stepOneSchema.parseAsync(formData);
  //     await stepTwoSchema.parseAsync(formData);
  //     setErrors({});
  //     setIsSubmitting(true);

  //     const form = new FormData();

  //     // Append primitive fields
  //     form.append("companyName", formData.companyName);
  //     form.append("legalowner", formData.legalowner);
  //     form.append("locationOfRegistration", formData.locationOfRegistration);
  //     form.append("companyRegistrationYear", formData.companyRegistrationYear);
  //     form.append("address", JSON.stringify(formData.address));
  //     form.append("mainCategory", formData.mainCategory);
  //     form.append("subCategory", formData.mainProduct.join(","));
  //     form.append("acceptedCurrency", formData.acceptedCurrency.join(","));
  //     form.append(
  //       "acceptedPaymentType",
  //       formData.acceptedPaymentType.join(",")
  //     );
  //     form.append("languageSpoken", formData.languageSpoken.join(","));
  //     form.append("companyDescription", formData.companyDescription);

  //     // Append optional files safely
  //     if (formData.logo instanceof File) {
  //       form.append("logo", formData.logo);
  //     }

  //     if (Array.isArray(formData.companyPhotos)) {
  //       formData.companyPhotos.forEach((photo, idx) => {
  //         if (photo instanceof File) form.append("companyPhotos", photo);
  //       });
  //     }

  //     if (Array.isArray(formData.companyVideos)) {
  //       formData.companyVideos.forEach((video, idx) => {
  //         if (video instanceof File) form.append("companyVideo", video);
  //       });
  //     }

  //     console.log("Files appended successfully ✅");

  //     // Send request
  //     const res = await api.post("/company/register", form ,{
  //        headers: { "Content-Type": undefined },
  //     });
  //     console.log("Response:", res);

  //     if (!res.data.success) {
  //       throw new Error(res.data.message || "Something went wrong");
  //     }

  //     if (res.status === 201) {
  //       alert("Company registered successfully");
  //       localStorage.removeItem("companyFormData");
  //       localStorage.removeItem("currentStep");
  //     }
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //     const formatted = mapZodErrors(err);
  //     setErrors(formatted);

  //     // Jump to the step where error occurred
  //     if (
  //       formatted["companyName"] ||
  //       formatted["address.street"] ||
  //       formatted["acceptedCurrency"]
  //     ) {
  //       setCurrentStep(1);
  //     } else if (
  //       formatted["companyDescription"] ||
  //       formatted["logo"] ||
  //       formatted["companyPhotos"]
  //     ) {
  //       setCurrentStep(2);
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      console.log("Submitting form data...");
      await stepOneSchema.parseAsync(formData);
      await stepTwoSchema.parseAsync(formData);
      setErrors({});
      setIsSubmitting(true);

      const form = new FormData();

      // Append primitive fields
      form.append("companyName", formData.companyName);
      form.append("legalowner", formData.legalowner);
      form.append("locationOfRegistration", formData.locationOfRegistration);
      form.append("companyRegistrationYear", formData.companyRegistrationYear);
      form.append("address", JSON.stringify(formData.address));
      form.append("mainCategory", formData.mainCategory);
      form.append("subCategory", formData.mainProduct.join(","));
      form.append("acceptedCurrency", formData.acceptedCurrency.join(","));
      form.append(
        "acceptedPaymentType",
        formData.acceptedPaymentType.join(",")
      );
      form.append("languageSpoken", formData.languageSpoken.join(","));
      form.append("companyDescription", formData.companyDescription);

      // Append optional files safely
      if (formData.logo instanceof File) {
        form.append("logo", formData.logo);
      }

      if (Array.isArray(formData.companyPhotos)) {
        formData.companyPhotos.forEach((photo) => {
          if (photo instanceof File) form.append("companyPhotos", photo);
        });
      }

      // Only append first video to match multer maxCount = 1
      if (
        Array.isArray(formData.companyVideos) &&
        formData.companyVideos[0] instanceof File
      ) {
        form.append("companyVideo", formData.companyVideos[0]);
      }

      console.log("Files appended successfully ✅");

      // Send request (do NOT set Content-Type manually)
      const res = await api.post("/company/register", form);
      console.log("Response:", res);

      if (!res.data.success) {
        throw new Error(res.data.message || "Something went wrong");
      }

      if (res.status === 201) {
        alert("Company registered successfully");
        localStorage.removeItem("companyFormData");
        localStorage.removeItem("currentStep");
      }
    } catch (err) {
      console.error("Submit error:", err);
      const formatted = mapZodErrors(err);
      setErrors(formatted);

      // Jump to the step where error occurred
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
    } finally {
      setIsSubmitting(false);
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

        {/* Step indicators */}
        <div className="flex justify-between mt-6">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex-1 text-center relative">
                <div
                  className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full 
            ${
              isActive || isCompleted
                ? "bg-navyblue text-white"
                : "bg-gray-300 text-gray-700"
            }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>

                <p
                  className={`mt-2 text-sm font-medium ${
                    isActive ? "text-navyblue" : "text-gray-600"
                  }`}
                >
                  {step.title}
                </p>

                {/* Connector line between steps */}
                {step.id < steps.length && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2 z-[-1]
              ${isCompleted ? "bg-navyblue" : "bg-gray-300"}`}
                  ></div>
                )}
              </div>
            );
          })}
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
              <Button onClick={prevStep} variant={"formButton"}>
                Back
              </Button>
            )}
          </div>

          <div className="ml-auto flex gap-2">
            {currentStep < steps.length ? (
              // <button
              //   onClick={nextStep}
              //   className="flex items-center gap-3 px-4 py-2 bg-navyblue text-white rounded cursor-pointer"
              // >
              //   Next <MoveRight size={20}/>
              // </button>
              <Button onClick={nextStep} variant={"formButton"}>
                Next <MoveRight size={20} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant={"formButton"}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
