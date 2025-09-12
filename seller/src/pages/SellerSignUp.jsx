import React, { useState } from "react";
import { Check } from "lucide-react";
import { assets } from "@/assets/assets";
import { Link } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const SellerSignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    gstin: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    category: "",
  });

  const [otp, setOtp] = useState("");
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const steps = [
    { id: 1, title: "Account Details" },
    { id: 2, title: "Create Password" },
    { id: 3, title: "Business Info" },
  ];

  // Handle changes for all form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setErrors({ ...errors, otp: "" });
  };

  // Validates a 10-digit mobile number
  const validateMobile = () => {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number." });
      return false;
    }
    setErrors({ mobile: "" });
    return true;
  };

  // Handles sending the OTP
  const handleSendOtp = () => {
    if (validateMobile()) {
      console.log(`OTP sent at your given number ${formData.mobile}`);
      setShowModal(true);
      setModalMessage("OTP sent at your given number {123456}");
      setShowOtpField(true);
    }
  };

  // Handles OTP verification and enables registration
  const handleVerifyOtp = () => {
    if (otp === "123456") {
      // Hardcoded for demo purposes
      setIsMobileVerified(true);
      setShowModal(true);
      setModalMessage("Mobile number verified successfully!");
    } else {
      setErrors({ otp: "Invalid OTP. Please try again." });
    }
  };

  // Handles the main registration button click
  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required.";
    }
    if (!isMobileVerified) {
      newErrors.otp = "Please verify your mobile number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setStep(2);
    }
  };

  // Handles password creation flow
  const handlePasswordContinue = () => {
    if (formData.password === formData.confirmPassword) {
      setStep(3);
    } else {
      setErrors({ confirmPassword: "Passwords do not match." });
    }
  };

  // Final form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Data:", formData);
    setModalMessage(
      "Form submitted successfully! You're ready to start selling."
    );
    setShowModal(true);
  };

  // Custom modal component to replace alert()
  const Modal = ({ message, onClose }) => {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
          <p className="text-gray-800 font-semibold mb-4">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-[#0c2c43] text-white py-2 rounded-xl hover:bg-[#1a4361] transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased">
      <header className="w-full shadow-md h-16 md:h-20 flex items-center px-4 md:px-10">
        <Link to={"/"} className="flex items-center">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>
      </header>

      <div className="grid md:grid-cols-2 lg:max-w-4xl xl:max-w-6xl w-full  rounded-3xl shadow-2xl overflow-hidden sm:m-auto  border border-green-500 ">
        {/* Left Column: The Form */}
        <div className="bg-white  p-6 sm:p-8 md:p-12 md:rounded-l-3xl border border-red-500">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              Become a Seller
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              Start your journey with us in just a few steps.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center mb-10 md:mb-12 relative">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
            {steps.map((item, index) => (
              <div
                key={item.id}
                className="relative flex flex-col items-center flex-1"
              >
                {/* Circle */}
                <div
                  className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full border-2 transform transition-all duration-300 ease-in-out
                    ${
                      step > item.id
                        ? "bg-[#0c2c43] text-white"
                        : step === item.id
                        ? "border-[#0c2c43] text-[#0c2c43] bg-white shadow-md scale-110"
                        : "border-gray-300 text-gray-400 bg-white"
                    }`}
                >
                  {step > item.id ? (
                    <Check size={18} className="stroke-[2.5px]" />
                  ) : (
                    item.id
                  )}
                </div>

                {/* Title */}
                <span
                  className={`mt-2 md:mt-4 text-[10px] sm:text-xs md:text-sm font-semibold text-center whitespace-nowrap transition-colors duration-300
                    ${step >= item.id ? "text-gray-900" : "text-gray-400"}`}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Account Details */}
          {step === 1 && (
            <form
              className="space-y-5 md:space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter Mobile Number *"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0c2c43] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>
                {!isMobileVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!formData.mobile || formData.mobile.length !== 10}
                    className="px-4 py-3 md:px-5 md:py-4 bg-gray-200 text-gray-600 rounded-2xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send OTP
                  </button>
                )}
              </div>

              {showOtpField && !isMobileVerified && (
                <div className="w-full">
                  {/* OTP + Resend + Verify in one line */}
                  <div className="flex items-center gap-4 w-full">
                    {/* Shadcn InputOTP */}
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => {
                        setOtp(value);
                        setErrors({ ...errors, otp: "" });
                      }}
                      className="flex-1 justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>

                    {/* Resend link */}
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSendOtp();
                      }}
                      className="text-sm text-navyblue font-semibold hover:underline whitespace-nowrap"
                    >
                      Resend
                    </Link>

                    {/* Verify button */}
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6} // disable until 6 digits entered
                      className={`px-5 py-2 rounded-lg font-semibold transition 
          ${
            otp.length === 6
              ? "bg-navyblue text-white hover:bg-blue-900"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
                    >
                      Verify
                    </button>
                  </div>

                  {/* Error message */}
                  {errors.otp && (
                    <p className="text-red-500 text-sm text-center mt-2">
                      {errors.otp}
                    </p>
                  )}
                </div>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email ID *"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0c2c43] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
              <input
                type="text"
                name="gstin"
                placeholder="Enter GSTIN (Optional)"
                value={formData.gstin}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0c2c43] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={handleRegister}
                disabled={!isMobileVerified}
                className={`w-full py-3 md:py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isMobileVerified
                    ? "bg-[#0c2c43] text-white hover:bg-[#1a4361] "
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Register
              </button>
            </form>
          )}

          {/* Step 2: Password Creation */}
          {step === 2 && (
            <form
              className="space-y-5 md:space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="password"
                name="password"
                placeholder="Create Password *"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0c2c43] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0c2c43] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2 md:px-6 md:py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors duration-200"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handlePasswordContinue}
                  className="px-6 py-3 md:px-8 md:py-4 bg-[#0c2c43] text-white rounded-2xl font-bold hover:bg-[#1a4361] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Continue →
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Business Info */}
          {step === 3 && (
            <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0c2c43] focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0c2c43] focus:border-transparent transition-all duration-200 text-gray-500"
              >
                <option value="">Select Category</option>
                <option value="All">All Categories</option>
                <option value="Books">Only Books</option>
                <option value="Electronics">Electronics</option>
              </select>
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2 md:px-6 md:py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors duration-200"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 md:px-8 md:py-4 bg-[#0c2c43] text-white rounded-2xl font-bold hover:bg-[#1a4361] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Content & Image */}
        <div className="hidden md:block bg-[#0c2c43] p-8 md:rounded-r-3xl border">
          <div className="h-full flex flex-col justify-between items-center text-white text-center">
            {/* Top Div: Content */}
            <div className="flex flex-col justify-center items-center h-1/2">
              <h2 className="text-3xl font-extrabold mb-4">
                Grow Your Business with Us
              </h2>
              <p className="max-w-xs text-lg opacity-90">
                Unlock a world of opportunities. Our platform provides the tools
                you need to reach new customers and succeed.
              </p>
            </div>

            {/* Bottom Div: Image */}
            <div className="flex flex-col justify-center items-center h-1/2">
              <img
                src={assets.whysellerlove}
                alt="Business Growth Illustration"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal message={modalMessage} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default SellerSignUp;
