import User from "../models/user.model.js";
import asyncHandler from "../middleware/buyer/asyncHandler.js";
import AppError from "../utils/buyer/AppError.js";
import { generateOTP, getOTPExpiry } from "../utils/buyer/otpUtils.js";
import { sendOTPSMS } from "../utils/buyer/sendNumberbyTwilio.js";
import logger from "../config/winston.js";

// Validation helper
const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

// ======================== SEND OTP ========================
export const sendOtp = asyncHandler(async (req, res, next) => {
  const { mobile } = req.body;
  console.log(req.body);
  // Validation
  if (!mobile || !isValidMobile(mobile)) {
    return next(new AppError("Valid mobile number is required", 400));
  }

  // ✅ Check if user exists
  let user = await User.findByMobile(mobile);

  // ✅ If user exists and already has seller role → error
  if (user && user.hasRole("seller")) {
    return next(new AppError("Mobile already registered as seller", 409));
  }

  // ✅ Generate OTP
  const otp = generateOTP();
  const otpExpires = getOTPExpiry();

  // ✅ If user doesn't exist, create temporary user
  if (!user) {
    user = await User.create({
      mobile,
      otp,
      otpExpires,
      isMobileVerified: false,
      role: ["user"], // Default role
    });

    logger.info("Temporary user created for OTP", {
      userId: user._id,
      mobile,
    });
  } else {
    // ✅ Update existing user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    logger.info("OTP updated for existing user", {
      userId: user._id,
      mobile,
    });
  }

  // ✅ Send OTP via SMS
  const smsResult = await sendOTPSMS(mobile, otp);

  if (!smsResult.success) {
    return next(new AppError("Failed to send OTP. Please try again", 500));
  }

  logger.info("OTP sent successfully", { mobile, userId: user._id });

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

// ======================== VERIFY OTP ========================
export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { mobile, otp } = req.body;
  console.log(req.body);

  if (!mobile || !otp) {
    return next(new AppError("Mobile and OTP are required", 400));
  }

  // ✅ Find user with OTP fields
  const user = await User.findOne({ mobile }).select("+otp +otpExpires");

  if (!user) {
    return next(new AppError("User not found. Please send OTP first", 404));
  }

  // ✅ Verify OTP using user method
  const verification = user.verifyOtp(otp);

  if (!verification.valid) {
    logger.warn("OTP verification failed", {
      mobile,
      reason: verification.message,
    });
    return next(new AppError(verification.message, 400));
  }

  // ✅ Mark mobile as verified
  user.isMobileVerified = true;
  await user.clearOtp(); // Clear OTP fields
  await user.save();

  logger.info("Mobile verified successfully", {
    mobile,
    userId: user._id,
  });

  res.status(200).json({
    success: true,
    message: "Mobile verified successfully",
    userId: user._id, // ✅ Return for reference
  });
});
