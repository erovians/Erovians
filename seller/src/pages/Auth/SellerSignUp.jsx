import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { assets } from "@/assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerSeller, clearSellerState } from "@/redux/slice/sellerSlice";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import api from "@/utils/axios.utils";

import {
  validateEmail,
  validateMobile,
  validateGstin,
  validatePassword,
  validateOtp,
} from "@/utils/validation.utils";

const SellerSignUp = () => {
  const [step, setStep] = useState(1);
  const [otpStatus, setOtpStatus] = useState("idle");
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    gstin: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    category: "All",

    documentFile: null,
  });

  const [otp, setOtp] = useState("");
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const steps = [
    { id: 1, title: "EMAIL ID & GST" },
    { id: 2, title: "PASSWORD & DOCUMENTS" },
    { id: 3, title: "BUSINESS DETAILS" },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.seller
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSendOtp = async () => {
    const mobileError = validateMobile(formData.mobile);
    if (mobileError) {
      setErrors((prev) => ({ ...prev, mobile: mobileError }));
      return;
    }

    setErrors((prev) => ({ ...prev, otp: "" }));
    setOtpStatus("sending");

    try {
      const response = await api.post(`/seller/send-otp`, {
        mobile: formData.mobile,
      });

      if (response.data.success) {
        setOtpStatus("sent");
        setShowModal(true);
        setModalMessage("OTP sent to your number!");
        setShowOtpField(true);
      } else {
        setOtpStatus("idle");
        setShowModal(true);
        setModalMessage(
          response.data.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setOtpStatus("idle");
      setShowModal(true);
      setModalMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    const otpError = validateOtp(otp);
    if (otpError) {
      setErrors((prev) => ({ ...prev, otp: otpError }));
      return;
    }

    try {
      const res = await api.post(`/seller/verify-otp`, {
        mobile: formData.mobile,
        otp,
      });

      if (res.data.success) {
        setIsMobileVerified(true);
        setOtpStatus("verified");
        setShowModal(true);
        setModalMessage("Mobile number verified successfully!");
        setErrors((prev) => ({ ...prev, otp: "" }));
      } else {
        setErrors((prev) => ({ ...prev, otp: res.data.message }));
        setOtpStatus("sent");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setErrors((prev) => ({
        ...prev,
        otp: "Invalid OTP. Please try again.",
      }));
      setOtpStatus("sent");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const mobileError = validateMobile(formData.mobile);
    if (mobileError) newErrors.mobile = mobileError;

    const gstinError = validateGstin(formData.gstin);
    if (gstinError) newErrors.gstin = gstinError;

    if (!isMobileVerified) {
      newErrors.otp = "Please verify your mobile number with OTP to continue.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await api.post("/seller/check-unique", {
        email: formData.email,
        gstin: formData.gstin,
      });

      if (!res.data.success) {
        setErrors((prev) => ({ ...prev, [res.data.field]: res.data.message }));
        setShowModal(true);
        setModalMessage(res.data.message);
        return;
      }

      setStep(2);
    } catch (err) {
      console.error("Error checking unique:", err);
      setShowModal(true);
      setModalMessage("Server error. Please try again.");
    }
  };

  const handlePasswordContinue = () => {
    const passwordError = validatePassword(
      formData.password,
      formData.confirmPassword
    );

    if (passwordError) {
      setErrors({ confirmPassword: passwordError });
    } else {
      setStep(3);
      setErrors({});
    }
  };

  // ✅ New handleFileUpload function - now just saves the file object
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setModalMessage("File size exceeds 5MB. Please choose a smaller file.");
      setShowModal(true);
      e.target.value = "";
      return;
    }

    const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!acceptedTypes.includes(file.type)) {
      setModalMessage("Invalid file type. Only JPG, PNG, and PDF are allowed.");
      setShowModal(true);
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, documentFile: file }));
    setModalMessage("Document selected!");
    setShowModal(true);
  };

  // ✅ New handleSubmit function - sends a single request with all data and the file
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.documentFile) {
      setModalMessage("Please upload the required document.");
      setShowModal(true);
      return;
    }

    if (!formData.businessName) {
      setErrors({ businessName: "Business name is required." });
      return;
    }

    const finalSellerData = new FormData();
    finalSellerData.append("email", formData.email);
    finalSellerData.append("mobile", formData.mobile);
    finalSellerData.append("gstin", formData.gstin);
    finalSellerData.append("password", formData.password);
    finalSellerData.append("businessName", formData.businessName);
    finalSellerData.append("category", formData.category);
    finalSellerData.append("file", formData.documentFile);

    dispatch(registerSeller(finalSellerData));
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
        <div>
          <div className="flex justify-between items-center mb-8 text-xs sm:text-sm font-semibold text-gray-600">
            {steps.map((item) => (
              <div key={item.id} className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    step >= item.id
                      ? "border-[#0c2c43] text-[#0c2c43]"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step > item.id ? <Check size={14} /> : item.id}
                </div>
                <span className="mt-2 text-center">{item.title}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <form className="space-y-5" onSubmit={handleRegister}>
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
                    disabled={
                      !formData.mobile ||
                      formData.mobile.length !== 10 ||
                      otpStatus === "sending" ||
                      otpStatus === "verified"
                    }
                    className={`px-4 py-2 sm:py-0 font-semibold text-sm text-white border-t sm:border-t-0 sm:border-l border-gray-200 
                    ${
                      otpStatus === "verified"
                        ? "bg-green-600"
                        : otpStatus === "sending"
                        ? "bg-gray-400"
                        : "bg-navyblue"
                    }`}
                  >
                    {otpStatus === "sending"
                      ? "Sending..."
                      : otpStatus === "sent"
                      ? "Sent"
                      : otpStatus === "verified"
                      ? "Verified"
                      : "Send OTP"}
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
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
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

              <input
                type="email"
                name="email"
                placeholder="Email ID *"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-sm outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}

              <input
                type="text"
                name="gstin"
                placeholder="GSTIN *"
                value={formData.gstin}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md text-sm outline-none ${
                  errors.gstin ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.gstin && (
                <p className="text-red-500 text-sm mt-1">{errors.gstin}</p>
              )}

              <p className="text-xs text-gray-500 mt-4 leading-snug">
                By continuing, I agree to{" "}
                <Link to={"/"} className="text-blue-600 font-medium ">
                  Terms of Use & Privacy Policy
                </Link>
                .
              </p>

              <button
                type="submit"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload GSTIN Document (JPG, PNG, PDF)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 border rounded-md text-sm outline-none"
                />
                {formData.documentFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Document selected!
                  </p>
                )}
              </div>

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
                  disabled={
                    !formData.password ||
                    !formData.confirmPassword ||
                    errors.confirmPassword ||
                    !formData.documentFile
                  }
                  className={`bg-[#0c2c43] text-white px-6 py-2 rounded-md font-bold w-full sm:w-auto ${
                    !formData.password ||
                    !formData.confirmPassword ||
                    errors.confirmPassword ||
                    !formData.documentFile
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "hover:bg-[#1a4361]"
                  }`}
                >
                  Continue →
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="businessName"
                placeholder="Business Name *"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-sm outline-none"
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm">{errors.businessName}</p>
              )}

              <label className="block text-sm font-medium text-gray-700">
                Business Category
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                {["All", "Marbles", "Granites"].map((cat) => (
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
                  disabled={!formData.businessName || loading}
                  className={`bg-[#0c2c43] text-white px-6 py-2 rounded-md font-bold w-full sm:w-auto ${
                    !formData.businessName
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "hover:bg-[#1a4361]"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="hidden md:flex flex-col gap-6">
          <div className="p-4 border rounded-md shadow-sm">
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
