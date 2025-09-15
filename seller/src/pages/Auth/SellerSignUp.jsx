import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { assets } from "@/assets/assets";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerSeller, clearSellerState } from "@/redux/slice/sellerSlice";
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
    category: "All",
  });

  const [otp, setOtp] = useState("");
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const steps = [
    { id: 1, title: "EMAIL ID & GST" },
    { id: 2, title: "PASSWORD CREATION" },
    { id: 3, title: "ONBOARDING DASHBOARD" },
  ];

  // Input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateMobile = () => {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number." });
      return false;
    }
    setErrors({ mobile: "" });
    return true;
  };

  const handleSendOtp = () => {
    if (validateMobile()) {
      setShowModal(true);
      setModalMessage("OTP sent to your number (123456)");
      setShowOtpField(true);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === "123456") {
      setIsMobileVerified(true);
      setShowModal(true);
      setModalMessage("Mobile number verified successfully!");
    } else {
      setErrors({ otp: "Invalid OTP. Please try again." });
    }
  };

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

  const handlePasswordContinue = () => {
    if (formData.password === formData.confirmPassword) {
      setStep(3);
    } else {
      setErrors({ confirmPassword: "Passwords do not match." });
    }
  };

  // Inside your component
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.seller
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sellerData = {
      email: formData.email,
      mobile: formData.mobile,
      gstin: formData.gstin,
      password: formData.password,
      businessName: formData.businessName,
      category: formData.category,
    };

    dispatch(registerSeller(sellerData));
  };

  useEffect(() => {
    if (successMessage) {
      setModalMessage(successMessage);
      setShowModal(true);
      dispatch(clearSellerState());
    }
    if (error) {
      setModalMessage(error);
      setShowModal(true);
      dispatch(clearSellerState());
    }
  }, [successMessage, error, dispatch]);

  const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
        <p className="text-gray-800 font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#0c2c43] text-white py-2 rounded-md hover:bg-[#1a4361] transition"
        >
          OK
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="w-full shadow-md h-14 sm:h-16 md:h-20 flex items-center px-4 sm:px-6">
        <Link to={"/"}>
          <img
            src={assets.logo}
            alt="Logo"
            className="h-6 sm:h-8 md:h-10 w-auto object-contain"
          />
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 md:px-12 py-8 md:py-12 max-w-6xl mx-auto">
        {/* Left Section */}
        <div>
          {/* Stepper */}
          <div className="flex  md:items-center md:justify-between mb-8 text-xs sm:text-sm font-semibold text-gray-600">
            {steps.map((item, i) => (
              <div key={item.id} className="flex items-center flex-col">
                {/* Step Circle */}
                <div
                  className={`w-6 h-6 rounded-full flex  items-center justify-center border-2 ${
                    step >= item.id
                      ? "border-[#0c2c43] text-[#0c2c43]"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step > item.id ? <Check size={14} /> : item.id}
                </div>

                {/* Title */}
                <span className="ml-2 text-xs md:ml-2 mt-2 md:mt-0 text-center md:text-left">
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Mobile */}
              <div className="flex border rounded-md overflow-hidden flex-col sm:flex-row">
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter Mobile Number *"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 text-sm outline-none"
                />
                {!isMobileVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!formData.mobile || formData.mobile.length !== 10}
                    className="px-4 py-2 sm:py-0  font-semibold text-sm text-white disabled:text-gray-600 disabled:bg-white border-t sm:border-t-0 sm:border-l border-gray-200 bg-navyblue "
                  >
                    Send OTP
                  </button>
                )}
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}

              {showOtpField && !isMobileVerified && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
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
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6}
                    className={`w-full sm:w-auto px-5 py-2 rounded-md font-semibold ${
                      otp.length === 6
                        ? "bg-[#0c2c43] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    Verify
                  </button>
                </div>
              )}
              {errors.otp && (
                <p className="text-red-500 text-sm">{errors.otp}</p>
              )}

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email ID *"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-sm outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              {/* GST */}
              <input
                type="text"
                name="gstin"
                placeholder="Enter GSTIN "
                required
                value={formData.gstin}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-sm outline-none"
              />

              <button
                type="button"
                onClick={handleRegister}
                disabled={!isMobileVerified}
                className={`w-full py-3 rounded-md font-bold ${
                  isMobileVerified
                    ? "bg-[#0c2c43] text-white hover:bg-[#1a4361]"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Register & Continue →
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <input
                type="password"
                name="password"
                placeholder="Create Password *"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-sm outline-none"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-sm outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-500 font-semibold w-full sm:w-auto"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handlePasswordContinue}
                  className="bg-[#0c2c43] text-white px-6 py-2 rounded-md font-bold w-full sm:w-auto"
                >
                  Continue →
                </button>
              </div>
            </form>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-sm outline-none"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                {["All", "Books", "Electronics"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`flex-1 border rounded-md py-3 font-medium ${
                      formData.category === cat
                        ? "border-[#0c2c43] text-[#0c2c43]"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-gray-500 font-semibold w-full sm:w-auto"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-[#0c2c43] text-white px-6 py-2 rounded-md font-bold w-full sm:w-auto"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="p-2 border rounded-md shadow-sm">
            <p className="text-sm text-gray-700 mb-2">
              List with Erovians, Grow With Erovians, Explore with Erovians !!
            </p>
            <p className="text-xs text-gray-500">
              List your products to sell them worldwide.
            </p>
          </div>
          <div>
            <img
              src={assets.SellerSignupform}
              alt="Seller Banner"
              className="rounded-md "
            />
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
