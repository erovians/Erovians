import User from "../../models/user.model.js";
import { sendSMS } from "../../utils/buyer/sendNumberbyTwilio.js";
import sendMail from "../../utils/buyer/sendEmailByBrevo.js";
import asyncHandler from "../../middleware/buyer/asyncHandler.js";
import AppError from "../../utils/buyer/AppError.js";
import sendToken from "../../utils/buyer/sendToken.js";
import logger from "../../config/winston.js";
import validator from "validator";

// ==========================================
// 1. ADMIN LOGIN - CHECK PASSWORD & ROLE, THEN SEND OTP
// ==========================================
export const adminLogin = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body;
  console.log("this is req.body", req.body);

  // Validation
  if (!identifier || !password) {
    return next(new AppError("Email/Phone and Password are required", 400));
  }

  // Check if email or phone
  const isEmail = validator.isEmail(identifier);

  // Find user with password field
  const user = await User.findByIdentifierWithAuth(identifier);

  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  // ✅ CHECK PASSWORD FIRST
  if (!user.hasPassword || !user.password) {
    return next(new AppError("Password not set for this account", 400));
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid credentials", 401));
  }

  // ✅ CHECK ROLE - Only admin, sub_admin, super_admin allowed
  const allowedRoles = ["admin", "sub_admin", "super_admin"];
  const hasAdminRole = user.role.some((role) => allowedRoles.includes(role));

  if (!hasAdminRole) {
    return next(
      new AppError("You are not authorized to access admin panel", 403)
    );
  }

  // Check if account is active
  if (user.status !== "active") {
    return next(new AppError(`Account is ${user.status}`, 403));
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  // Send OTP
  try {
    if (isEmail) {
      await sendMail({
        email: user.email,
        subject: "Admin Login OTP",
        message: `
          <h2>Admin Login Verification</h2>
          <p>Your OTP for admin login is: <strong>${otp}</strong></p>
          <p>Valid for 10 minutes.</p>
        `,
      });
    } else {
      await sendSMS(
        user.mobile,
        `Your admin login OTP is: ${otp}. Valid for 10 minutes.`
      );
    }

    console.log("=== ADMIN LOGIN OTP ===");
    console.log("User ID:", user._id);
    console.log("Mobile/Email:", isEmail ? user.email : user.mobile);
    console.log("OTP:", otp);
    console.log("=======================");

    logger.info("Admin login OTP sent", {
      userId: user._id,
      method: isEmail ? "email" : "phone",
    });

    // ✅ SEND userId IN RESPONSE
    res.status(200).json({
      success: true,
      message: `OTP sent to your ${isEmail ? "email" : "phone"}`,
      userId: user._id,
      identifier,
      otpExpiresAt: otpExpires,
      otpSent: true,
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    logger.error("OTP sending failed", { error: error.message });
    return next(new AppError("Failed to send OTP", 500));
  }
});

// ==========================================
// 2. VERIFY OTP & LOGIN - USE userId
// ==========================================
export const verifyAdminOTP = asyncHandler(async (req, res, next) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return next(new AppError("User ID and OTP are required", 400));
  }

  // Find user by ID with auth fields
  const user = await User.findById(userId).select(
    "+password +otp +otpExpires +loginAttempts +lockUntil"
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Verify OTP
  const otpVerification = user.verifyOtp(otp);

  if (!otpVerification.valid) {
    return next(new AppError(otpVerification.message, 400));
  }

  // Clear OTP and update last login
  await user.clearOtp();
  await user.updateLastLogin();

  // Send token and user data
  sendToken(user, 200, res, "Login successful");

  logger.info("Admin logged in successfully", {
    userId: user._id,
    role: user.role,
  });
});

// ==========================================
// 3. LOAD ADMIN - GET FULL DETAILS
// ==========================================
export const loadAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user.toSafeObject(),
  });
});

// ==========================================
// 4. RESEND OTP - USE userId
// ==========================================
export const resendAdminOTP = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  const user = await User.findById(userId).select("+otp +otpExpires");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isEmail = user.email && validator.isEmail(user.email);

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  console.log("=== ADMIN RESEND OTP ===");
  console.log("User ID:", user._id);
  console.log("Mobile/Email:", isEmail ? user.email : user.mobile);
  console.log("OTP:", otp);
  console.log("========================");

  // Send OTP
  try {
    if (isEmail) {
      await sendMail({
        email: user.email,
        subject: "Admin Login OTP - Resend",
        message: `<p>Your new OTP is: <strong>${otp}</strong></p>`,
      });
    } else {
      await sendSMS(user.mobile, `Your new admin login OTP is: ${otp}`);
    }

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      otpExpiresAt: otpExpires,
    });
  } catch (error) {
    return next(new AppError("Failed to resend OTP", 500));
  }
});

// ==========================================
// 5. LOGOUT
// ==========================================
export const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
