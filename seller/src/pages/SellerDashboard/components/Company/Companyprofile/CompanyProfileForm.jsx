import React, { useEffect, useState } from "react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import ReviewStep from "./steps/ReviewStep";
import {
  stepOneSchema,
  stepTwoSchema,
} from "../../../schema/companyRegistrationForm.schema";
import { Check, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import { registerCompany, clearCompanyState } from "@/redux/slice/companySlice";
import { toast } from "sonner";
import api from "@/utils/axios.utils";

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
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("currentStep");
    return savedStep ? Number(savedStep) : 1;
  });

  const dispatch = useDispatch();

  const { loading, error, success, message } = useSelector(
    (state) => state.company
  );

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
          mainCategory: [],
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
    async function loadProfile() {
      try {
        const res = await api.get("/company/details");

        if (!res.data.company) {
          setLoadingProfile(false);
          return;
        }

        const c = res.data.company;

        setFormData((prev) => ({
          ...prev,

          companyName: c.companyBasicInfo?.companyName || "",
          legalowner: c.companyBasicInfo?.legalowner || "",
          locationOfRegistration:
            c.companyBasicInfo?.locationOfRegistration || "",
          companyRegistrationYear:
            c.companyBasicInfo?.companyRegistrationYear || "",

          address: {
            ...prev.address,
            ...c.companyBasicInfo?.address,
          },

          mainCategory: c.companyBasicInfo?.mainCategory || [],
          mainProduct: c.companyBasicInfo?.subCategory || [],
          acceptedCurrency: c.companyBasicInfo?.acceptedCurrency || [],
          acceptedPaymentType: c.companyBasicInfo?.acceptedPaymentType || [],
          languageSpoken: c.companyBasicInfo?.languageSpoken || [],

          companyDescription: c.companyIntro?.companyDescription || "",

          logoUrl: c.companyIntro?.logo || "",
          companyPhotosUrl: c.companyIntro?.companyPhotos || [],
          companyVideosUrl: c.companyIntro?.companyVideos || [],
        }));

        setLoadingProfile(false);
      } catch (err) {
        console.error("Error loading profile", err);
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

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

      const form = new FormData();

      // Append primitive fields
      form.append("companyName", formData.companyName);
      form.append("legalowner", formData.legalowner);
      form.append("locationOfRegistration", formData.locationOfRegistration);
      form.append("companyRegistrationYear", formData.companyRegistrationYear);
      form.append("address", JSON.stringify(formData.address));
      form.append("mainCategory", JSON.stringify(formData.mainCategory));
      form.append("subCategory", JSON.stringify(formData.mainProduct));
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

      const result = await dispatch(registerCompany(form)).unwrap(); // redux disptach
      // alert(result.message);
      toast.success(result.message);
      localStorage.removeItem("companyFormData");
      localStorage.removeItem("currentStep");
      dispatch(clearCompanyState());
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
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-7xl mx-auto rounded bg-white">
      <div className="p-2 md:p-4">
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
                  className={`mx-auto text-sm w-8 h-8 flex items-center justify-center rounded-full 
            ${
              isActive || isCompleted
                ? "bg-navyblue text-white"
                : "bg-gray-300 text-gray-700"
            }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>

                <p
                  className={`mt-2 text-xs font-medium ${
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

      <div className="pt-6 md:p-6 ">
        <CurrentComponent
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

        <div className="mt-6 flex gap-2 justify-between items-center">
          <div>
            {currentStep > 1 && (
              <Button onClick={prevStep} variant="secondary">
                Back
              </Button>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            {currentStep < steps.length ? (
              <Button onClick={nextStep} variant="secondary">
                Next <MoveRight size={20} />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant={"formButton"}
                disabled={loading}
              >
                {loading && <Spinner />}
                {loading ? "Submitting" : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
