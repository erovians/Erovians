import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import SellerSignupform from "../assets/SellerSignupform.svg";
import seller_logo from "../assets/seller_logo.png";
import { useSelector, useDispatch } from "react-redux";
import { verifyOTP, resendOTP, clearError, clearSuccess  , loadUser} from "../lib/redux/auth/authSlice";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(600);

  // Redux state
  const { loading, error, success, message } = useSelector((state) => state.auth);
  
  // Get userId from location state or localStorage
  const userId = location.state?.userId || localStorage.getItem("userId");

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (success && message) {
      toast.success(message);
      dispatch(clearSuccess());
    }
  }, [error, success, message, dispatch]);

  // Redirect to login if no userId
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [userId, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    const result = await dispatch(verifyOTP({ userId, otp }));
    
    // If verification successful, navigate to dashboard
    if (result.type === "auth/verifyOTP/fulfilled") {
      localStorage.removeItem("userId");
      localStorage.removeItem("otpExpiresAt");
      sessionStorage.setItem('justLoggedIn', 'true');
      // await dispatch(loadUser());
      navigate("/");
    }
  };

  const handleResend = async () => {
    const result = await dispatch(resendOTP({ userId }));
    
    // Reset timer if resend successful
    if (result.type === "auth/resendOTP/fulfilled") {
      setTimer(600);
      setOtp("");
    }
  };

  return (
    <div className="w-full h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

        {/* ===== LEFT IMAGE ===== */}
        <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-gray-100">
          <img
            src={SellerSignupform}
            alt="verify"
            className="w-full max-w-md h-auto object-contain"
          />
        </div>

        {/* ===== RIGHT FORM ===== */}
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">

            {/* Logo */}
            <div className="mb-8">
              <img
                src={seller_logo}
                alt="EROVIANS"
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verify with OTP
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Sent to{" "}
              <span className="font-semibold text-gray-900">{userId}</span>
            </p>

            {/* Form */}
            <form onSubmit={handleVerify} className="space-y-5">

              {/* OTP Input */}
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit OTP"
                className="w-full h-12 border-2 border-gray-300 rounded-lg px-4 text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-sm placeholder:tracking-normal placeholder:font-sans"
              />

              {/* Timer */}
              <div className="text-center text-sm">
                {timer > 0 ? (
                  <p className="text-gray-500">
                    OTP expires in:{" "}
                    <span className="font-semibold text-gray-900">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <p className="text-red-500 font-medium">OTP expired</p>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || timer === 0}
                className="w-full h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              {/* Resend Button */}
              <button
                type="button"
                onClick={handleResend}
                disabled={loading || timer > 540}
                className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resending..." : "Resend OTP"}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyOTP;