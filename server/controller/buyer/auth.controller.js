import asyncHandler from "../../middleware/buyer/asyncHandler.js";
import User from "../../models/user.model.js";
import AppError from "../../utils/buyer/AppError.js";
import validator from "validator";
import sendMail from "../../utils/buyer/sendEmailByBrevo.js";
import { sendOTPSMS } from "../../utils/buyer/sendNumberbyTwilio.js";
import {
  generateOTP,
  getOTPExpiry,
  isOTPExpired,
  verifyOTP as verifyOTPUtil,
} from "../../utils/buyer/otpUtils.js";
import { getOTPEmailTemplate } from "../../utils/buyer/emailTemplate.js";
import logger from "../../config/winston.js";
import sendToken from "../../utils/buyer/sendToken.js";

// ========================================
// 1. Check User & Send OTP
// ========================================
export const checkUserAndSendOTP = asyncHandler(async (req, res, next) => {
  const { email, mobile } = req.body;
  console.log("this is mobile", mobile);

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

// ========================================
// 5. GET USER PROFILE (Me)
// ========================================
export const getMe = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  logger.info("User profile requested", { userId });

  // Find user by ID
  const user = await User.findById(userId);

  if (!user) {
    logger.warn("Profile request for non-existent user", { userId });
    return next(new AppError("User not found", 404));
  }

  logger.info("User profile retrieved successfully", {
    userId,
    email: user.email,
  });

  // Send response with user data
  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    data: user.toSafeObject(),
  });
});

// ========================================
// 6. LOGOUT USER
// ========================================
export const logoutUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  logger.info("Logout request", { userId });

  const user = await User.findById(userId);

  // Check if user exists
  if (!user) {
    logger.warn("Logout attempted for non-existent user", { userId });
    return next(new AppError("User not found", 404));
  }

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  };

  // Clear both tokens
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  logger.info("User logged out successfully", {
    userId,
    email: user.email,
  });

  // Send response
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ========================================
// 7. UPDATE USER Basic Profile
// ========================================
export const updateBasicProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { name, gender, buyer_country } = req.body;
  console.log("this is update basic profile req.body", req.body);

  logger.info("Profile update request", { userId, updates: req.body });

  // Find user
  const user = await User.findById(userId);

  if (!user) {
    logger.warn("Profile update attempted for non-existent user", { userId });
    return next(new AppError("User not found", 404));
  }

  // Validate name (required)
  if (!name || name.trim().length < 2) {
    return next(
      new AppError("Name is required and must be at least 2 characters", 400)
    );
  }

  // Validate name format (only letters and spaces)
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return next(new AppError("Name can only contain letters and spaces", 400));
  }

  // Validate gender (if provided)
  if (gender && !["male", "female", "others"].includes(gender)) {
    return next(new AppError("Invalid gender value", 400));
  }

  // Validate buyer_country (if provided)
  if (buyer_country && buyer_country.trim().length > 50) {
    return next(new AppError("Country name cannot exceed 50 characters", 400));
  }

  // Update fields
  user.name = name.trim();

  if (gender) {
    user.gender = gender;
  }

  if (buyer_country) {
    user.buyer_country = buyer_country.trim();
  }

  // Save user
  await user.save();

  logger.info("Profile updated successfully", {
    userId,
    name: user.name,
    gender: user.gender,
    buyer_country: user.buyer_country,
  });

  // Send response
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user.toSafeObject(),
  });
});

// ========================================
// 8. UPDATE USER ADDRESS
// ========================================
export const updateAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { type, action, data, index } = req.body;
  console.log("this is update address req body", req.body);

  logger.info("Address update request", {
    userId,
    type,
    action,
    index,
  });

  // Validate type
  if (!type || !["billing", "shipping"].includes(type)) {
    return next(
      new AppError("Invalid address type. Must be 'billing' or 'shipping'", 400)
    );
  }

  // Validate action
  if (!action || !["add", "edit", "delete"].includes(action)) {
    return next(
      new AppError("Invalid action. Must be 'add', 'edit', or 'delete'", 400)
    );
  }

  // Find user
  const user = await User.findById(userId);

  if (!user) {
    logger.warn("Address update attempted for non-existent user", { userId });
    return next(new AppError("User not found", 404));
  }

  // Determine which address array to work with
  const addressField =
    type === "billing" ? "billing_address" : "shipping_address";
  const addresses = user[addressField] || [];

  // Handle different actions
  if (action === "add") {
    // Validate required fields for add
    if (!data) {
      return next(new AppError("Address data is required", 400));
    }

    const { name, mobile, city, state, country, pincode } = data;

    // Validate required fields
    if (!name || name.trim().length < 1) {
      return next(new AppError("Address name is required", 400));
    }

    if (!mobile || !validator.isMobilePhone(mobile.toString(), "any")) {
      return next(new AppError("Valid mobile number is required", 400));
    }

    if (!city || city.trim().length < 1) {
      return next(new AppError("City is required", 400));
    }

    if (!state || state.trim().length < 1) {
      return next(new AppError("State is required", 400));
    }

    if (!country || country.trim().length < 1) {
      return next(new AppError("Country is required", 400));
    }

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return next(new AppError("Valid 6-digit pincode is required", 400));
    }

    // Validate alternate mobile if provided
    if (
      data.alternateMobile &&
      !validator.isMobilePhone(data.alternateMobile.toString(), "any")
    ) {
      return next(new AppError("Invalid alternate mobile number", 400));
    }

    // Create new address object
    const newAddress = {
      name: name.trim(),
      mobile: mobile.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      pincode: pincode.trim(),
      alternateMobile: data.alternateMobile
        ? data.alternateMobile.trim()
        : undefined,
      landmark: data.landmark ? data.landmark.trim() : undefined,
    };

    // Add to array
    addresses.push(newAddress);
    user[addressField] = addresses;

    logger.info(`${type} address added`, {
      userId,
      addressCount: addresses.length,
    });
  } else if (action === "edit") {
    // Validate index
    if (
      index === undefined ||
      index === null ||
      index < 0 ||
      index >= addresses.length
    ) {
      return next(new AppError("Invalid address index", 400));
    }

    // Validate required fields for edit
    if (!data) {
      return next(new AppError("Address data is required", 400));
    }

    const { name, mobile, city, state, country, pincode } = data;

    // Validate required fields
    if (!name || name.trim().length < 1) {
      return next(new AppError("Address name is required", 400));
    }

    if (!mobile || !validator.isMobilePhone(mobile.toString(), "any")) {
      return next(new AppError("Valid mobile number is required", 400));
    }

    if (!city || city.trim().length < 1) {
      return next(new AppError("City is required", 400));
    }

    if (!state || state.trim().length < 1) {
      return next(new AppError("State is required", 400));
    }

    if (!country || country.trim().length < 1) {
      return next(new AppError("Country is required", 400));
    }

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return next(new AppError("Valid 6-digit pincode is required", 400));
    }

    // Validate alternate mobile if provided
    if (
      data.alternateMobile &&
      !validator.isMobilePhone(data.alternateMobile.toString(), "any")
    ) {
      return next(new AppError("Invalid alternate mobile number", 400));
    }

    // Update address at index
    addresses[index] = {
      name: name.trim(),
      mobile: mobile.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      pincode: pincode.trim(),
      alternateMobile: data.alternateMobile
        ? data.alternateMobile.trim()
        : undefined,
      landmark: data.landmark ? data.landmark.trim() : undefined,
    };

    user[addressField] = addresses;

    logger.info(`${type} address updated`, {
      userId,
      index,
    });
  } else if (action === "delete") {
    // Validate index
    if (
      index === undefined ||
      index === null ||
      index < 0 ||
      index >= addresses.length
    ) {
      return next(new AppError("Invalid address index", 400));
    }

    // Remove address at index
    addresses.splice(index, 1);
    user[addressField] = addresses;

    logger.info(`${type} address deleted`, {
      userId,
      index,
      remainingCount: addresses.length,
    });
  }

  // Save user
  await user.save();

  logger.info("Address updated successfully", {
    userId,
    type,
    action,
    totalAddresses: user[addressField].length,
  });

  // Send response
  res.status(200).json({
    success: true,
    message: `${
      type.charAt(0).toUpperCase() + type.slice(1)
    } address ${action}ed successfully`,
    data: user.toSafeObject(),
  });
});
