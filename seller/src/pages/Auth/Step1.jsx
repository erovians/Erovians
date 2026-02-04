import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link } from "react-router-dom";

const Step1 = ({
  formData,
  errors,
  otp,
  otpStatus,
  isMobileVerified,
  showOtpField,
  onFormChange,
  onOtpChange,
  onSendOtp,
  onVerifyOtp,
  onSubmit,
}) => {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {/* Mobile Number with OTP */}
      <div>
        <div className="flex rounded-md overflow-hidden flex-col sm:flex-row">
          <PhoneInput
            international
            defaultCountry="IN"
            value={formData.mobile}
            onChange={(value) =>
              onFormChange({ target: { name: "mobile", value: value || "" } })
            }
            placeholder="Enter Mobile Number *"
            disabled={isMobileVerified}
            className="flex-1 phone-input-custom"
          />
          {!isMobileVerified && (
            <button
              type="button"
              onClick={onSendOtp}
              disabled={otpStatus === "sending" || otpStatus === "verified"}
              className={`px-4 py-2 sm:py-0 font-semibold text-sm text-white border-t sm:border-t-0 sm:border-l border-gray-200 
                ${
                  otpStatus === "verified"
                    ? "bg-green-600"
                    : otpStatus === "sending"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-navyblue hover:bg-[#1a4361]"
                }`}
            >
              {otpStatus === "sending"
                ? "Sending..."
                : otpStatus === "sent"
                ? "Resend OTP"
                : otpStatus === "verified"
                ? "✓ Verified"
                : "Send OTP"}
            </button>
          )}
          {isMobileVerified && (
            <div className="px-4 py-2 sm:py-0 font-semibold text-sm text-white bg-green-600 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-gray-200">
              ✓ Verified
            </div>
          )}
        </div>
        {errors.mobile && (
          <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
        )}
      </div>

      {/* OTP Input Field */}
      {showOtpField && !isMobileVerified && (
        <div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={onOtpChange}
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
              onClick={onVerifyOtp}
              disabled={otp.length !== 6}
              className={`w-full sm:w-auto px-5 py-2 rounded-md font-semibold transition ${
                otp.length === 6
                  ? "bg-[#0c2c43] text-white hover:bg-[#1a4361]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Verify OTP
            </button>
          </div>
          {errors.otp && (
            <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
          )}
        </div>
      )}

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email ID *"
          value={formData.email}
          onChange={onFormChange}
          className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* GSTIN */}
      <div>
        <input
          type="text"
          name="businessId"
          placeholder="GSTIN (Business ID) *"
          value={formData.businessId}
          onChange={onFormChange}
          className={`w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43] ${
            errors.businessId ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.businessId && (
          <p className="text-red-500 text-sm mt-1">{errors.businessId}</p>
        )}
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 mt-4 leading-snug">
        By continuing, I agree to{" "}
        <Link to={"/"} className="text-blue-600 font-medium hover:underline">
          Terms of Use & Privacy Policy
        </Link>
        .
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isMobileVerified}
        className={`w-full py-3 rounded-md font-bold transition ${
          isMobileVerified
            ? "bg-[#0c2c43] text-white hover:bg-[#1a4361]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isMobileVerified
          ? "Register & Continue →"
          : "Please Verify Mobile First"}
      </button>
    </form>
  );
};

export default Step1;
