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
import {
  registerCompany,
  clearCompanyState,
  getCompany,
} from "@/redux/slice/companySlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    id: 1,
    title: "Company Basic Details",
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("currentStep");
    return savedStep ? Number(savedStep) : 1;
  });

  const { company, loading, error } = useSelector((state) => state.company);
  const loadingProfile = loading;

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
          companyDescription: "",
          logo: null,
          companyPhotos: [],
          companyVideos: [],
        };
  });

  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);

  // ✅ Fetch company data on mount
  useEffect(() => {
    dispatch(getCompany());
  }, [dispatch]);

  // ✅ Populate form when company data arrives
  useEffect(() => {
    if (company) {
      const c = company;

      // Helper function to split comma-separated strings
      const splitString = (str) => {
        if (!str) return [];
        if (Array.isArray(str)) {
          // If already array, flatten and split each item
          return str.flatMap((item) =>
            typeof item === "string"
              ? item.split(",").map((s) => s.trim())
              : item
          );
        }
        return str.split(",").map((s) => s.trim());
      };

      setFormData((prev) => ({
        ...prev,
        companyName: c.companyBasicInfo?.companyName || "",
        legalowner: c.companyBasicInfo?.legalowner || "",
        locationOfRegistration:
          c.companyBasicInfo?.locationOfRegistration || "",
        companyRegistrationYear: c.companyBasicInfo?.companyRegistrationYear
          ? new Date(c.companyBasicInfo.companyRegistrationYear)
              .getFullYear()
              .toString()
          : "",
        address: {
          street: c.companyBasicInfo?.address?.street || "",
          city: c.companyBasicInfo?.address?.city || "",
          stateOrProvince: c.companyBasicInfo?.address?.stateOrProvince || "",
          countryOrRegion: c.companyBasicInfo?.address?.countryOrRegion || "",
          postalCode: c.companyBasicInfo?.address?.postalCode || "",
        },
        mainCategory: c.companyBasicInfo?.mainCategory || [],
        mainProduct: c.companyBasicInfo?.subCategory || [],
        acceptedCurrency: splitString(c.companyBasicInfo?.acceptedCurrency),
        acceptedPaymentType: splitString(
          c.companyBasicInfo?.acceptedPaymentType
        ),
        languageSpoken: splitString(c.companyBasicInfo?.languageSpoken),
        companyDescription: c.companyIntro?.companyDescription || "",
        logoUrl: c.companyIntro?.logo || "",
        companyPhotosUrl: c.companyIntro?.companyPhotos || [],
        companyVideosUrl: c.companyIntro?.companyVideos || [],
      }));
    }
  }, [company]);

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

      const form = new FormData();

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

      if (formData.logo instanceof File) {
        form.append("logo", formData.logo);
      }

      if (Array.isArray(formData.companyPhotos)) {
        formData.companyPhotos.forEach((photo) => {
          if (photo instanceof File) form.append("companyPhotos", photo);
        });
      }

      if (
        Array.isArray(formData.companyVideos) &&
        formData.companyVideos[0] instanceof File
      ) {
        form.append("companyVideo", formData.companyVideos[0]);
      }

      const result = await dispatch(registerCompany(form)).unwrap();

      toast.success(result.message || "Company registered successfully!");

      localStorage.removeItem("companyFormData");
      localStorage.removeItem("currentStep");

      dispatch(clearCompanyState());

      setTimeout(() => {
        navigate("/sellerdashboard");
      }, 1000);
    } catch (err) {
      console.error("Submit error:", err);
      const formatted = mapZodErrors(err);
      setErrors(formatted);

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

      <div className="pt-6 md:p-6">
        {loadingProfile ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
            <span className="ml-2">Loading company details...</span>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
