import React, { useEffect, useState } from "react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import ReviewStep from "./steps/ReviewStep";
import { Check, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  saveCompany,
  getCompany,
  clearError,
  clearSuccess,
} from "@/redux/slice/companySlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { loadSeller } from "@/redux/slice/sellerSlice";

const steps = [
  {
    id: 1,
    title: "Company Basic Details",
    component: StepOne,
  },
  {
    id: 2,
    title: "Company Introduction",
    component: StepTwo,
  },
  { id: 3, title: "Review & Submit", component: ReviewStep },
];

export default function CompanyProfileForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(1);

  const { company, loading, error, success, message, seller_status } =
    useSelector((state) => state.company);
  const { seller } = useSelector((state) => state.seller);
  console.log("this is seller", seller);
  console.log("here is company details", company);

  const [formData, setFormData] = useState({
    // Basic Info
    companyName: "",
    company_registration_number: "",
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
    totalEmployees: "",
    businessType: "",
    factorySize: "",
    factoryCountryOrRegion: "",
    contractManufacturing: false,
    numberOfProductionLines: "",
    annualOutputValue: "",
    rdTeamSize: "",
    tradeCapabilities: [],
    // Company Intro
    companyDescription: "",
    logo: null,
    companyPhotos: [],
    companyVideos: [],
    registration_documents: [],
    // URL fields for existing data
    logoUrl: "",
    companyPhotosUrl: [],
    companyVideosUrl: [],
    registrationDocsUrl: [],
  });

  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);

  // ✅ Fetch company data on mount
  useEffect(() => {
    dispatch(getCompany());
  }, [dispatch]);

  // ✅ Populate form when company data arrives
  useEffect(() => {
    if (company === null) {
      toast.info("No company profile found. Let's create one! 🚀");
    } else if (company) {
      const c = company;

      // ✅ Helper to ensure array format
      const ensureArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
          return value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [];
      };

      setFormData({
        // Basic Info
        companyName: c.companyBasicInfo?.companyName || "",
        company_registration_number:
          c.companyBasicInfo?.company_registration_number || "",
        legalowner: c.companyBasicInfo?.legalowner || "",
        locationOfRegistration:
          c.companyBasicInfo?.locationOfRegistration || "",
        companyRegistrationYear:
          c.companyBasicInfo?.companyRegistrationYear || "",
        address: {
          street: c.companyBasicInfo?.address?.street || "",
          city: c.companyBasicInfo?.address?.city || "",
          stateOrProvince: c.companyBasicInfo?.address?.stateOrProvince || "",
          countryOrRegion: c.companyBasicInfo?.address?.countryOrRegion || "",
          postalCode: c.companyBasicInfo?.address?.postalCode || "",
        },
        // ✅ Fixed: Properly handle arrays
        mainCategory: ensureArray(c.companyBasicInfo?.mainCategory),
        mainProduct: ensureArray(c.companyBasicInfo?.subCategory),
        acceptedCurrency: ensureArray(c.companyBasicInfo?.acceptedCurrency),
        acceptedPaymentType: ensureArray(
          c.companyBasicInfo?.acceptedPaymentType
        ),
        languageSpoken: ensureArray(c.companyBasicInfo?.languageSpoken),
        tradeCapabilities: ensureArray(c.companyBasicInfo?.tradeCapabilities),
        totalEmployees: c.companyBasicInfo?.totalEmployees?.toString() || "",
        businessType: c.companyBasicInfo?.businessType || "",
        factorySize: c.companyBasicInfo?.factorySize || "",
        factoryCountryOrRegion:
          c.companyBasicInfo?.factoryCountryOrRegion || "",
        contractManufacturing:
          c.companyBasicInfo?.contractManufacturing || false,
        numberOfProductionLines:
          c.companyBasicInfo?.numberOfProductionLines?.toString() || "",
        annualOutputValue: c.companyBasicInfo?.annualOutputValue || "",
        rdTeamSize: c.companyBasicInfo?.rdTeamSize?.toString() || "",
        // Company Intro
        companyDescription: c.companyIntro?.companyDescription || "",
        // ✅ Store URLs separately
        logoUrl: c.companyIntro?.logo || "",
        companyPhotosUrl: ensureArray(c.companyIntro?.companyPhotos),
        companyVideosUrl: ensureArray(c.companyIntro?.companyVideos),
        registrationDocsUrl: ensureArray(
          c.companyBasicInfo?.registration_documents
        ),
        // Keep file arrays empty for updates
        logo: null,
        companyPhotos: [],
        companyVideos: [],
        registration_documents: [],
      });

      toast.success("Company data loaded! You can update it now. ✏️");
    }
  }, [company]);

  // ✅ Update progress
  useEffect(() => {
    setProgress(Math.round(((currentStep - 1) / (steps.length - 1)) * 100));
  }, [currentStep]);

  // ✅ Handle success/error
  useEffect(() => {
    if (success && message) {
      toast.success(message, {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        dispatch(clearSuccess());
        dispatch(loadSeller());
        navigate("/sellerdashboard");
      }, 1500);
    }

    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-center",
      });
      dispatch(clearError());
    }
  }, [success, error, message, dispatch, navigate]);

  const CurrentComponent = steps[currentStep - 1].component;

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.companyName?.trim()) {
        newErrors.companyName = "Company name is required";
      }
      if (!formData.company_registration_number?.trim()) {
        newErrors.company_registration_number =
          "Registration number is required";
      }
      if (!formData.legalowner?.trim()) {
        newErrors.legalowner = "Legal owner is required";
      }
      if (!formData.locationOfRegistration?.trim()) {
        newErrors.locationOfRegistration = "Location is required";
      }
      if (!formData.companyRegistrationYear) {
        newErrors.companyRegistrationYear = "Registration year is required";
      }
      if (!formData.address.street?.trim()) {
        newErrors["address.street"] = "Street is required";
      }
      if (!formData.address.city?.trim()) {
        newErrors["address.city"] = "City is required";
      }
      if (!formData.address.stateOrProvince?.trim()) {
        newErrors["address.stateOrProvince"] = "State/Province is required";
      }
      if (!formData.address.countryOrRegion?.trim()) {
        newErrors["address.countryOrRegion"] = "Country is required";
      }
      if (!formData.address.postalCode?.trim()) {
        newErrors["address.postalCode"] = "Postal code is required";
      }
      if (formData.mainCategory.length === 0) {
        newErrors.mainCategory = "At least one category is required";
      }
      if (formData.mainProduct.length === 0) {
        newErrors.mainProduct = "At least one product is required";
      }
      if (formData.acceptedCurrency.length === 0) {
        newErrors.acceptedCurrency = "Select at least one currency";
      }
      if (formData.acceptedPaymentType.length === 0) {
        newErrors.acceptedPaymentType = "Select at least one payment type";
      }
      if (formData.languageSpoken.length === 0) {
        newErrors.languageSpoken = "Select at least one language";
      }
    }

    if (step === 2) {
      if (!formData.companyDescription?.trim()) {
        newErrors.companyDescription = "Company description is required";
      } else if (formData.companyDescription.length < 50) {
        newErrors.companyDescription = "Minimum 50 characters required";
      }

      // ✅ Fixed: Check both new file and existing URL
      if (!company && !formData.logo && !formData.logoUrl) {
        newErrors.logo = "Company logo is required";
      }

      if (
        !company &&
        formData.companyPhotos.length === 0 &&
        formData.companyPhotosUrl.length === 0
      ) {
        newErrors.companyPhotos = "At least one photo is required";
      }

      if (
        !company &&
        formData.registration_documents.length === 0 &&
        formData.registrationDocsUrl.length === 0
      ) {
        newErrors.registration_documents =
          "At least one registration document is required";
      }
    }

    return newErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Please fill all required fields", {
        position: "top-center",
      });
      return;
    }

    setErrors({});
    setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    try {
      const step1Errors = validateStep(1);
      const step2Errors = validateStep(2);
      const allErrors = { ...step1Errors, ...step2Errors };

      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        if (Object.keys(step1Errors).length > 0) {
          setCurrentStep(1);
        } else if (Object.keys(step2Errors).length > 0) {
          setCurrentStep(2);
        }
        toast.error("Please fix all errors before submitting", {
          position: "top-center",
        });
        return;
      }

      setErrors({});

      const form = new FormData();

      // Basic Info
      form.append("companyName", formData.companyName);
      form.append(
        "company_registration_number",
        formData.company_registration_number
      );
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

      // Optional fields
      if (formData.totalEmployees) {
        form.append("totalEmployees", formData.totalEmployees);
      }
      if (formData.businessType) {
        form.append("businessType", formData.businessType);
      }
      if (formData.factorySize) {
        form.append("factorySize", formData.factorySize);
      }
      if (formData.factoryCountryOrRegion) {
        form.append("factoryCountryOrRegion", formData.factoryCountryOrRegion);
      }
      if (formData.contractManufacturing !== undefined) {
        form.append("contractManufacturing", formData.contractManufacturing);
      }
      if (formData.numberOfProductionLines) {
        form.append(
          "numberOfProductionLines",
          formData.numberOfProductionLines
        );
      }
      if (formData.annualOutputValue) {
        form.append("annualOutputValue", formData.annualOutputValue);
      }
      if (formData.rdTeamSize) {
        form.append("rdTeamSize", formData.rdTeamSize);
      }
      if (formData.tradeCapabilities?.length > 0) {
        form.append("tradeCapabilities", formData.tradeCapabilities.join(","));
      }

      // Company Intro
      form.append("companyDescription", formData.companyDescription);

      // Files - Logo
      if (formData.logo instanceof File) {
        form.append("logo", formData.logo);
      }

      // Files - Photos
      if (Array.isArray(formData.companyPhotos)) {
        formData.companyPhotos.forEach((photo) => {
          if (photo instanceof File) form.append("companyPhotos", photo);
        });
      }

      // Files - Video
      if (
        Array.isArray(formData.companyVideos) &&
        formData.companyVideos[0] instanceof File
      ) {
        form.append("companyVideo", formData.companyVideos[0]);
      }

      // Files - Registration Documents
      if (Array.isArray(formData.registration_documents)) {
        formData.registration_documents.forEach((doc) => {
          if (doc instanceof File) form.append("registration_documents", doc);
        });
      }

      await dispatch(saveCompany(form)).unwrap();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.message || "Something went wrong", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto rounded bg-white">
      <div className="p-2 md:p-4">
        {/* Progress Bar */}
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-navyblue rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
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
        {loading && currentStep === 1 ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
            <span className="ml-2 text-gray-600">
              Loading company details...
            </span>
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
                    {loading
                      ? "Saving..."
                      : company
                      ? "Update Company"
                      : "Create Company"}
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
