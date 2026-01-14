import asyncHandler from "../../middleware/users/asyncHandler.js";
import User from "../../models/user.model.js";
import AppError from "../../utils/users/AppError.js";
import validator from "validator";
import sendMail from "../../utils/users/sendEmailByBrevo.js";
import { sendOTPSMS } from "../../utils/users/sendNumberbyTwilio.js";
import {
  generateOTP,
  getOTPExpiry,
  isOTPExpired,
  verifyOTP as verifyOTPUtil,
} from "../../utils/users/otpUtils.js";
import { getOTPEmailTemplate } from "../../utils/users/emailTemplate.js";
import logger from "../../config/winston.js";
import sendToken from "../../utils/users/sendToken.js";

// ========================================
// 1. Check User & Send OTP
// ========================================
export const checkUserAndSendOTP = asyncHandler(async (req, res, next) => {
  const { email, mobile } = req.body;

  // Validate input
  if (!email && !mobile) {
    return next(new AppError("Please provide email or mobile number", 400));
  }

  // Determine identifier type
  const isEmail = !!email;
  const identifier = isEmail ? email.toLowerCase().trim() : mobile.trim();

  // Validate format
  if (isEmail && !validator.isEmail(identifier)) {
    return next(new AppError("Please provide a valid email address", 400));
  }

  if (!isEmail && !validator.isMobilePhone(identifier, "any")) {
    return next(new AppError("Please provide a valid mobile number", 400));
  }

  // Check if user exists
  let user = isEmail
    ? await User.findByEmail(identifier)
    : await User.findByMobile(identifier);

  const isNewUser = !user;

  // If new user, create a temporary user document
  if (isNewUser) {
    user = new User(isEmail ? { email: identifier } : { mobile: identifier });
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpires = getOTPExpiry();

  // Save OTP to user
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save({ validateBeforeSave: false });

  // Send OTP
  try {
    if (isEmail) {
      // Send OTP via Email
      const purpose = isNewUser ? "register" : "login";
      await sendMail({
        email: identifier,
        subject: `Your OTP for ${isNewUser ? "Registration" : "Login"}`,
        message: getOTPEmailTemplate(otp, purpose),
      });

      logger.info("OTP sent via email", {
        email: identifier,
        isNewUser,
        purpose,
      });
    } else {
      // Send OTP via SMS
      const result = await sendOTPSMS(identifier, otp);

      if (!result.success) {
        return next(new AppError("Failed to send OTP via SMS", 500));
      }

      logger.info("OTP sent via SMS", {
        mobile: identifier,
        isNewUser,
      });
    }

    // Response
    res.status(200).json({
      success: true,
      message: `OTP sent successfully to your ${isEmail ? "email" : "mobile"}`,
      isNewUser,
      identifier,
      otpPurpose: isNewUser ? "register" : "login",
      otpExpiresAt: otpExpires,
    });
  } catch (error) {
    // Clear OTP on send failure
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.error("Failed to send OTP", {
      error: error.message,
      identifier,
      isEmail,
    });

    return next(new AppError(`Failed to send OTP: ${error.message}`, 500));
  }
});

// ========================================
// 2. Verify OTP
// ========================================
export const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, mobile, otp } = req.body;

  // Validate input
  if (!email && !mobile) {
    return next(new AppError("Please provide email or mobile number", 400));
  }

  if (!otp) {
    return next(new AppError("Please provide OTP", 400));
  }

  // Validate OTP format
  if (!/^\d{6}$/.test(otp)) {
    return next(new AppError("Invalid OTP format", 400));
  }

  // Determine identifier type
  const isEmail = !!email;
  const identifier = isEmail ? email.toLowerCase().trim() : mobile.trim();

  // Find user with OTP fields
  const user = isEmail
    ? await User.findByEmailWithAuth(identifier)
    : await User.findByMobileWithAuth(identifier);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check if user has OTP
  if (!user.otp || !user.otpExpires) {
    return next(new AppError("No OTP found. Please request a new one", 400));
  }

  // Check if OTP expired
  if (isOTPExpired(user.otpExpires)) {
    return next(new AppError("OTP has expired. Please request a new one", 400));
  }

  // Verify OTP
  const isValid = verifyOTPUtil(otp, user.otp);

  if (!isValid) {
    logger.warn("Invalid OTP attempt", {
      userId: user._id,
      identifier,
    });
    return next(new AppError("Invalid OTP", 400));
  }

  // Clear OTP
  user.otp = undefined;
  user.otpExpires = undefined;

  // Check if user has name (to determine if registration is complete)
  const isNewUser = !user.name;

  if (isNewUser) {
    // New user - needs to complete registration (provide name)
    // Mark as verified but don't login yet
    if (isEmail) {
      user.isEmailVerified = true;
    } else {
      user.isMobileVerified = true;
    }
    await user.save({ validateBeforeSave: false });

    logger.info("OTP verified for new user", {
      userId: user._id,
      identifier,
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. Please complete your profile",
      isNewUser: true,
      data: user.toSafeObject(),
    });
  } else {
    // Existing user - login complete
    if (isEmail) {
      user.isEmailVerified = true;
    } else {
      user.isMobileVerified = true;
    }
    await user.save({ validateBeforeSave: false });

    logger.info("OTP verified and user logged in", {
      userId: user._id,
      identifier,
    });

    // Send tokens
    sendToken(user, 200, res, "Login successful");
  }
});

// ========================================
// 3. Complete Registration (Submit Name)
// ========================================
export const completeRegistration = asyncHandler(async (req, res, next) => {
  const { email, mobile, name } = req.body;

  // Validate input
  if (!email && !mobile) {
    return next(new AppError("Please provide email or mobile number", 400));
  }

  if (!name || name.trim().length < 2) {
    return next(
      new AppError("Please provide a valid name (minimum 2 characters)", 400)
    );
  }

  // Validate name format
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return next(new AppError("Name can only contain letters and spaces", 400));
  }

  // Determine identifier type
  const isEmail = !!email;
  const identifier = isEmail ? email.toLowerCase().trim() : mobile.trim();

  // Find user
  const user = isEmail
    ? await User.findByEmail(identifier)
    : await User.findByMobile(identifier);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check if user is verified
  const isVerified = isEmail ? user.isEmailVerified : user.isMobileVerified;

  if (!isVerified) {
    return next(new AppError("Please verify your account first", 400));
  }

  // Check if name already exists
  if (user.name) {
    return next(new AppError("Profile already completed", 400));
  }

  // Update user with name
  user.name = name.trim();
  await user.save();

  logger.info("Registration completed", {
    userId: user._id,
    name: user.name,
    identifier,
  });

  // Send tokens and login
  sendToken(user, 201, res, "Registration completed successfully");
});

// ========================================
// 4. Resend OTP
// ========================================
export const resendOTP = asyncHandler(async (req, res, next) => {
  const { email, mobile } = req.body;

  // Validate input
  if (!email && !mobile) {
    return next(new AppError("Please provide email or mobile number", 400));
  }

  // Determine identifier type
  const isEmail = !!email;
  const identifier = isEmail ? email.toLowerCase().trim() : mobile.trim();

  // Find user
  const user = isEmail
    ? await User.findByEmail(identifier)
    : await User.findByMobile(identifier);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpires = getOTPExpiry();

  // Save OTP to user
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save({ validateBeforeSave: false });

  // Send OTP
  try {
    if (isEmail) {
      // Send OTP via Email
      const purpose = user.name ? "login" : "register";
      await sendMail({
        email: identifier,
        subject: `Your OTP Code`,
        message: getOTPEmailTemplate(otp, purpose),
      });

      logger.info("OTP resent via email", {
        email: identifier,
        userId: user._id,
      });
    } else {
      // Send OTP via SMS
      const result = await sendOTPSMS(identifier, otp);

      if (!result.success) {
        return next(new AppError("Failed to resend OTP via SMS", 500));
      }

      logger.info("OTP resent via SMS", {
        mobile: identifier,
        userId: user._id,
      });
    }

    // Response
    res.status(200).json({
      success: true,
      message: `OTP resent successfully to your ${
        isEmail ? "email" : "mobile"
      }`,
      otpExpiresAt: otpExpires,
    });
  } catch (error) {
    // Clear OTP on send failure
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.error("Failed to resend OTP", {
      error: error.message,
      identifier,
      userId: user._id,
    });

    return next(new AppError(`Failed to resend OTP: ${error.message}`, 500));
  }
});

export const getMe = asyncHandler(async (req, res, next) => {
  console.log("done dana done ");
  res.send("done dana done");
});

export const logoutUser = asyncHandler(async (req, res, next) => {});
