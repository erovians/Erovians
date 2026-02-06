import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone, Mail, ArrowLeft, Lock, KeyRound } from "lucide-react";
import { assets } from "../assets/assets";
import Layout from "../components/common/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { toast } from "sonner";
import {
  checkUserAndSendOTP,
  verifyOTP,
  completeRegistration,
  loginWithPassword,
  resendOTP,
  setLoginMethod,
  setAuthMode,
  setLoginType,
  resetAuthFlow,
  clearError,
  clearSuccess,
} from "../lib/redux/auth/authSlice";
import LoadingOverlay from "../components/common/LoadingOverlay";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
    success,
    message,
    step,
    identifier,
    loginMethod,
    authMode,
    loginType,
    isAuthenticated,
    nextRoute,
  } = useSelector((state) => state.auth);

  const [phoneValue, setPhoneValue] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    name: "",
    password: "",
  });

  // Handle success messages
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearSuccess());
    }
  }, [success, message, dispatch]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Redirect after authentication
  useEffect(() => {
    if (isAuthenticated && nextRoute) {
      navigate(nextRoute);
    }
  }, [isAuthenticated, nextRoute, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginMethodChange = (method) => {
    dispatch(setLoginMethod(method));
    setPhoneValue("");
    setFormData({ ...formData, email: "" });
  };

  const handleAuthModeChange = (mode) => {
    dispatch(setAuthMode(mode));
    setPhoneValue("");
    setFormData({
      email: "",
      otp: "",
      name: "",
      password: "",
    });
  };

  const getCurrentIdentifier = () => {
    return loginMethod === "mobile" ? phoneValue : formData.email;
  };

  // ========================================
  // 1. INITIAL SUBMIT (Check User & Send OTP)
  // ========================================
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    const currentIdentifier = getCurrentIdentifier();

    if (!currentIdentifier) {
      toast.error(
        `Please enter ${loginMethod === "mobile" ? "mobile number" : "email"}`
      );
      return;
    }

    const payload = {
      [loginMethod]: currentIdentifier,
    };

    dispatch(checkUserAndSendOTP(payload));
  };

  // ========================================
  // 2. LOGIN TYPE SELECTION (OTP or Password)
  // ========================================
  const handleLoginTypeSelection = (type) => {
    dispatch(setLoginType(type));

    if (type === "otp") {
      // Already OTP sent, just move to OTP step
      // No need to call API again
    } else if (type === "password") {
      // Move to password step
    }
  };

  // ========================================
  // 3. OTP SUBMIT (Verify OTP)
  // ========================================
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp || formData.otp.length !== 6) {
      toast.error("Please enter valid 6-digit OTP");
      return;
    }

    const payload = {
      [loginMethod]: identifier || getCurrentIdentifier(),
      otp: formData.otp,
    };

    dispatch(verifyOTP(payload));
  };

  // ========================================
  // 4. PASSWORD LOGIN SUBMIT
  // ========================================
  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || formData.password.length < 6) {
      toast.error("Please enter a valid password");
      return;
    }

    const payload = {
      [loginMethod]: identifier || getCurrentIdentifier(),
      password: formData.password,
    };

    dispatch(loginWithPassword(payload));
  };

  // ========================================
  // 5. NAME SUBMIT (Complete Registration)
  // ========================================
  const handleNameSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Please enter a valid name");
      return;
    }

    const payload = {
      [loginMethod]: identifier || getCurrentIdentifier(),
      name: formData.name.trim(),
    };

    dispatch(completeRegistration(payload));
  };

  // ========================================
  // RESEND OTP
  // ========================================
  const handleResendOTP = () => {
    const payload = {
      [loginMethod]: identifier || getCurrentIdentifier(),
    };

    dispatch(resendOTP(payload));
  };

  // ========================================
  // RESET FORM
  // ========================================
  const handleReset = () => {
    dispatch(resetAuthFlow());
    setPhoneValue("");
    setFormData({
      email: "",
      otp: "",
      name: "",
      password: "",
    });
  };

  return (
    <Layout hideFooter={true}>
      {loading && <LoadingOverlay />}
      <div className="bg-[#f8f9fa] flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side Image */}
            <div className="hidden lg:block p-8">
              <div className="relative">
                <img
                  src={assets.SellerSignupform}
                  alt="Shopping Illustration"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Right Side Form */}
            <div className="bg-white p-6 md:p-8 lg:p-12 flex items-center">
              <div className="w-full">
                {/* Logo */}
                <div className="mb-6">
                  <img
                    src={assets.logo}
                    alt="Logo"
                    className="h-10 w-auto mx-auto"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* ========================================
                    LOGIN / SIGNUP TABS (Only on initial step)
                    ======================================== */}
                {step === "initial" && (
                  <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => handleAuthModeChange("login")}
                      className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
                        authMode === "login"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleAuthModeChange("signup")}
                      className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
                        authMode === "signup"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                {/* ========================================
                    STEP 1: INITIAL (Mobile/Email Input)
                    ======================================== */}
                {step === "initial" && (
                  <>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      {authMode === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      {authMode === "login"
                        ? "Login to access your account"
                        : "Get access to your Orders, Wishlist and Recommendations"}
                    </p>

                    {/* Mobile/Email Toggle */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => handleLoginMethodChange("mobile")}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-all flex flex-col items-center ${
                          loginMethod === "mobile"
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Smartphone className="h-5 w-5 mb-1" />
                        <span className="text-xs">Mobile</span>
                      </button>
                      <button
                        onClick={() => handleLoginMethodChange("email")}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-all flex flex-col items-center ${
                          loginMethod === "email"
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Mail className="h-5 w-5 mb-1" />
                        <span className="text-xs">Email</span>
                      </button>
                    </div>

                    <form onSubmit={handleInitialSubmit}>
                      <div className="mb-4">
                        {loginMethod === "mobile" ? (
                          <PhoneInput
                            international
                            defaultCountry="IN"
                            value={phoneValue}
                            onChange={setPhoneValue}
                            placeholder="Enter Mobile Number"
                            className="phone-input-custom"
                          />
                        ) : (
                          <Input
                            type="email"
                            name="email"
                            placeholder="Enter Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mb-4">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-gray-900 hover:underline">
                          Terms of Use
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-gray-900 hover:underline">
                          Privacy Policy
                        </a>
                        .
                      </p>

                      <Button
                        type="submit"
                        disabled={loading || !getCurrentIdentifier()}
                        className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium"
                      >
                        {loading ? "Please wait..." : "Continue"}
                      </Button>
                    </form>

                    {/* Toggle Link */}
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        {authMode === "login" ? (
                          <>
                            New to our platform?{" "}
                            <button
                              onClick={() => handleAuthModeChange("signup")}
                              className="text-gray-900 hover:underline font-medium"
                            >
                              Create an account
                            </button>
                          </>
                        ) : (
                          <>
                            Already have an account?{" "}
                            <button
                              onClick={() => handleAuthModeChange("login")}
                              className="text-gray-900 hover:underline font-medium"
                            >
                              Login
                            </button>
                          </>
                        )}
                      </p>
                    </div>
                  </>
                )}

                {/* ========================================
                    STEP 2: LOGIN CHOICE (OTP vs Password)
                    ======================================== */}
                {step === "loginChoice" && (
                  <>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm">Back</span>
                    </button>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Choose Login Method
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      How would you like to login?
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleLoginTypeSelection("otp")}
                        className="w-full h-14 border-2 border-gray-300 hover:border-gray-900 rounded-lg flex items-center justify-between px-4 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-100 group-hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors">
                            <KeyRound className="h-5 w-5 text-gray-900 group-hover:text-white transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">
                              Login with OTP
                            </p>
                            <p className="text-xs text-gray-500">
                              We'll send you a one-time password
                            </p>
                          </div>
                        </div>
                        <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
                      </button>

                      <button
                        onClick={() => handleLoginTypeSelection("password")}
                        className="w-full h-14 border-2 border-gray-300 hover:border-gray-900 rounded-lg flex items-center justify-between px-4 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-100 group-hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors">
                            <Lock className="h-5 w-5 text-gray-900 group-hover:text-white transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">
                              Login with Password
                            </p>
                            <p className="text-xs text-gray-500">
                              Use your saved password
                            </p>
                          </div>
                        </div>
                        <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
                      </button>
                    </div>
                  </>
                )}

                {/* ========================================
                    STEP 3: OTP VERIFICATION
                    ======================================== */}
                {(step === "otp" ||
                  (step === "loginChoice" && loginType === "otp")) && (
                  <>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm">Back</span>
                    </button>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Verify with OTP
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Sent to {identifier || getCurrentIdentifier()}
                    </p>

                    <form onSubmit={handleOtpSubmit}>
                      <div className="mb-4">
                        <Input
                          type="text"
                          name="otp"
                          placeholder="Enter 6-digit OTP"
                          value={formData.otp}
                          onChange={handleChange}
                          maxLength={6}
                          className="w-full h-12 text-base tracking-widest text-center border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading || !formData.otp}
                        className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium"
                      >
                        {loading ? "Verifying..." : "Verify & Continue"}
                      </Button>
                    </form>

                    <div className="mt-4 text-center">
                      <button
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-sm text-gray-900 hover:underline font-medium disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </>
                )}

                {/* ========================================
                    STEP 4: PASSWORD LOGIN
                    ======================================== */}
                {step === "loginChoice" && loginType === "password" && (
                  <>
                    <button
                      onClick={() => dispatch(setLoginType(null))}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm">Back</span>
                    </button>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Enter Password
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Login with your password for{" "}
                      {identifier || getCurrentIdentifier()}
                    </p>

                    <form onSubmit={handlePasswordLoginSubmit}>
                      <div className="mb-4">
                        <Input
                          type="password"
                          name="password"
                          placeholder="Enter Password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading || !formData.password}
                        className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium"
                      >
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </form>

                    <div className="mt-4 text-center">
                      <button
                        onClick={() => handleLoginTypeSelection("otp")}
                        className="text-sm text-gray-900 hover:underline font-medium"
                      >
                        Login with OTP instead
                      </button>
                    </div>
                  </>
                )}

                {/* ========================================
                    STEP 5: NAME INPUT (New Users Only)
                    ======================================== */}
                {step === "name" && (
                  <>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm">Back</span>
                    </button>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Complete Your Profile
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Please enter your name to complete registration
                    </p>

                    <form onSubmit={handleNameSubmit}>
                      <div className="mb-4">
                        <Input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading || !formData.name}
                        className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium"
                      >
                        {loading
                          ? "Creating Account..."
                          : "Complete Registration"}
                      </Button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        Need help?{" "}
                        <a
                          href="#"
                          className="text-gray-900 hover:underline font-medium"
                        >
                          Contact Support
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
