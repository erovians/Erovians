import crypto from "crypto";
import logger from "../../config/winston.js";

export const generateOTP = () => {
  const buffer = crypto.randomBytes(3);
  const number = parseInt(buffer.toString("hex"), 16);
  const otp = (number % 900000) + 100000;

  // ✅ Log OTP generation (without exposing OTP value)
  logger.debug("OTP generated successfully");

  return otp.toString();
};

export const getOTPExpiry = () => {
  return new Date(Date.now() + 30 * 60 * 1000);
};

export const isOTPExpired = (otpExpires) => {
  const expired = new Date() > otpExpires;

  if (expired) {
    // ✅ Log expired OTP attempt
    logger.warn("OTP verification attempted with expired OTP", {
      expiryTime: otpExpires,
    });
  }

  return expired;
};

export const verifyOTP = (inputOTP, storedOTP) => {
  const isValid = inputOTP === storedOTP;

  // ✅ Log OTP verification result (without exposing OTP values)
  if (isValid) {
    logger.info("OTP verified successfully");
  } else {
    logger.warn("OTP verification failed - incorrect OTP provided");
  }

  return isValid;
};
