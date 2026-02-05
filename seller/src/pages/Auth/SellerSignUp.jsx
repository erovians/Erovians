import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOtp,
  verifyOtp,
  checkUnique,
  registerSeller,
  clearSellerState,
  clearError,
  clearSuccess,
} from "@/redux/slice/sellerSlice";
import {
  validateEmail,
  validatebusinessId,
  validatePassword,
  validateOtp,
} from "@/utils/validation.utils";

// Components
import StepIndicator from "@/pages/Auth/StepIndicator";
import Step1 from "@/pages/Auth/Step1";
import Step2 from "@/pages/Auth/Step2";
import Step3 from "@/pages/Auth/Step3";
import Modal from "@/pages/Auth/Modal";

const SellerSignUp = () => {
  const [step, setStep] = useState(1);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    // Step 1
    email: "",
    mobile: "",
    businessId: "",

    // Step 2
    sellername: "",
    password: "",
    confirmPassword: "",

    // Step 3 - Common
    seller_status: "",
    seller_address: "",
    seller_country: "",

    // Step 3 - Professional Only
    businessName: "",
    companyregstartionlocation: "",
    documentFile: null,
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");

  const steps = [
    { id: 1, title: "EMAIL & GST" },
    { id: 2, title: "PASSWORD" },
    { id: 3, title: "DETAILS" },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, successMessage, otpStatus, isMobileVerified } =
    useSelector((state) => state.seller);

  // ======================== HANDLE FORM CHANGE ========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ======================== SEND OTP ========================
  const handleSendOtp = async () => {
    if (!formData.mobile) {
      setErrors((prev) => ({ ...prev, mobile: "Mobile number is required" }));
      return;
    }

    setErrors((prev) => ({ ...prev, otp: "" }));
    const result = await dispatch(sendOtp(formData.mobile));

    if (sendOtp.fulfilled.match(result)) {
      setShowOtpField(true);
      setModalMessage("OTP sent to your number!");
      setModalType("success");
      setShowModal(true);
    }
  };

  // ======================== VERIFY OTP ========================
  const handleVerifyOtp = async () => {
    const otpError = validateOtp(otp);
    if (otpError) {
      setErrors((prev) => ({ ...prev, otp: otpError }));
      return;
    }

    const result = await dispatch(verifyOtp({ mobile: formData.mobile, otp }));

    if (verifyOtp.fulfilled.match(result)) {
      setModalMessage("Mobile verified successfully!");
      setModalType("success");
      setShowModal(true);
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  // ======================== STEP 1 ========================
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    }

    const businessIdError = validatebusinessId(formData.businessId);
    if (businessIdError) newErrors.businessId = businessIdError;

    if (!isMobileVerified) {
      newErrors.otp = "Please verify your mobile number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(
      checkUnique({
        email: formData.email,
        businessId: formData.businessId,
        mobile: formData.mobile,
      })
    );

    if (checkUnique.fulfilled.match(result)) {
      setStep(2);
    }
  };

  // ======================== STEP 2 ========================
  const handleStep2Continue = () => {
    const newErrors = {};

    if (!formData.sellername || formData.sellername.trim().length < 2) {
      newErrors.sellername = "Name required (min 2 characters)";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.sellername.trim())) {
      newErrors.sellername = "Only letters and spaces";
    }

    const passwordError = validatePassword(
      formData.password,
      formData.confirmPassword
    );

    if (passwordError) {
      newErrors.password = passwordError;
      newErrors.confirmPassword = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setModalMessage(Object.values(newErrors).join(". "));
      setModalType("error");
      setShowModal(true);
    } else {
      setStep(3);
      setErrors({});
    }
  };

  // ======================== FILE UPLOAD ========================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormData((prev) => ({ ...prev, documentFile: null }));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (file.size > maxSize) {
      setModalMessage("File size exceeds 5MB");
      setModalType("error");
      setShowModal(true);
      e.target.value = "";
      return;
    }

    if (!acceptedTypes.includes(file.type)) {
      setModalMessage("Only JPG, PNG, PDF allowed");
      setModalType("error");
      setShowModal(true);
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, documentFile: file }));
    setErrors((prev) => ({ ...prev, documentFile: "" }));
  };

  // ======================== STEP 3 SUBMIT ========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Common validations
    if (!formData.seller_status) {
      newErrors.seller_status = "Seller status required";
    }

    if (
      !formData.seller_address ||
      formData.seller_address.trim().length < 10
    ) {
      newErrors.seller_address = "Address required (min 10 characters)";
    }

    if (!formData.seller_country) {
      newErrors.seller_country = "Country required";
    }

    // Professional-specific validations
    if (formData.seller_status === "professional") {
      if (!formData.businessName || formData.businessName.trim().length < 2) {
        newErrors.businessName = "Business name required";
      }

      if (!formData.companyregstartionlocation) {
        newErrors.companyregstartionlocation = "Registration location required";
      }

      if (!formData.documentFile) {
        newErrors.documentFile = "Document required for professional sellers";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setModalMessage(Object.values(newErrors).join(". "));
      setModalType("error");
      setShowModal(true);
      return;
    }

    // Prepare FormData
    const finalData = new FormData();
    finalData.append("email", formData.email);
    finalData.append("mobile", formData.mobile);
    finalData.append("businessId", formData.businessId);
    finalData.append("password", formData.password);
    finalData.append("sellername", formData.sellername.trim());
    finalData.append("seller_status", formData.seller_status);
    finalData.append("seller_address", formData.seller_address.trim());
    finalData.append("seller_country", formData.seller_country.trim());

    // Professional-specific fields
    if (formData.seller_status === "professional") {
      finalData.append("businessName", formData.businessName.trim());
      finalData.append(
        "companyregstartionlocation",
        formData.companyregstartionlocation.trim()
      );
      if (formData.documentFile) {
        finalData.append("file", formData.documentFile);
      }
    }

    dispatch(registerSeller(finalData));
  };

  // ======================== SUCCESS/ERROR HANDLING ========================
  useEffect(() => {
    if (successMessage) {
      setModalMessage(successMessage);
      setModalType("success");
      setShowModal(true);

      const timer = setTimeout(() => {
        if (successMessage.toLowerCase().includes("registration")) {
          navigate("/login");
          dispatch(clearSellerState());
        } else {
          dispatch(clearSuccess());
        }
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (error) {
      setModalMessage(error);
      setModalType("error");
      setShowModal(true);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch, navigate]);

  // ======================== MODAL CLOSE ========================
  const handleModalClose = () => {
    setShowModal(false);
    if (successMessage?.toLowerCase().includes("registration")) {
      navigate("/login");
      dispatch(clearSellerState());
    }
  };

  // ======================== RENDER ========================
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="w-full shadow-md h-14 sm:h-16 md:h-20 flex items-center px-4 sm:px-6">
        <Link to={"/"}>
          <img src={assets.logo} alt="Logo" className="h-6 sm:h-8 md:h-10" />
        </Link>
      </header>

      {/* Main */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 md:px-12 py-8 max-w-6xl mx-auto">
        <div>
          <StepIndicator currentStep={step} steps={steps} />

          {step === 1 && (
            <Step1
              formData={formData}
              errors={errors}
              otp={otp}
              otpStatus={otpStatus}
              isMobileVerified={isMobileVerified}
              showOtpField={showOtpField}
              onFormChange={handleChange}
              onOtpChange={setOtp}
              onSendOtp={handleSendOtp}
              onVerifyOtp={handleVerifyOtp}
              onSubmit={handleStep1Submit}
            />
          )}

          {step === 2 && (
            <Step2
              formData={formData}
              errors={errors}
              onFormChange={handleChange}
              onBack={() => setStep(1)}
              onContinue={handleStep2Continue}
            />
          )}

          {step === 3 && (
            <Step3
              formData={formData}
              errors={errors}
              loading={loading}
              onFormChange={handleChange}
              onFileUpload={handleFileUpload}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="p-4 border rounded-md shadow-sm">
            <p className="text-sm text-gray-700 mb-2">
              List with Erovians, Grow With Erovians!
            </p>
            <p className="text-xs text-gray-500">
              List your products to sell worldwide.
            </p>
          </div>
          <img
            src={assets.SellerSignupform}
            alt="Banner"
            className="rounded-md"
          />
        </div>
      </div>

      {showModal && (
        <Modal
          message={modalMessage}
          type={modalType}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default SellerSignUp;
