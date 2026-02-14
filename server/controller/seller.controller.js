import mongoose from "mongoose";
import User from "../models/user.model.js";
import Seller from "../models/sellerSingnup.model.js";
import Company from "../models/company.model.js";
import asyncHandler from "../middleware/buyer/asyncHandler.js";
import AppError from "../utils/buyer/AppError.js";
import sendToken from "../utils/buyer/sendToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { generateOTP, getOTPExpiry } from "../utils/buyer/otpUtils.js";
import { sendOTPSMS } from "../utils/buyer/sendNumberbyTwilio.js";
import logger from "../config/winston.js";
import { validateBusinessIdByCountry } from "../utils/buyer/country.utils.js";

// ======================== VALIDATORS ========================
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidMobile = (mobile) => /^[+]?[1-9]\d{1,14}$/.test(mobile);

// ======================== SEND OTP ========================
export const sendOtp = asyncHandler(async (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile) {
    return next(new AppError("Mobile number is required", 400));
  }

  // ✅ FIX: Check existing user first
  let user = await User.findByMobile(mobile);

  if (user && user.hasRole("seller")) {
    return next(new AppError("Mobile already registered as seller", 409));
  }

  const otp = generateOTP();
  const otpExpires = getOTPExpiry();

  // ✅ FIX: Only create user if doesn't exist, but mark it clearly
  if (!user) {
    // Create temporary user - will be completed in registerSeller
    user = await User.create({
      mobile,
      otp,
      otpExpires,
      isMobileVerified: false,
      role: ["user"], // Minimal role, will be upgraded in registration
    });
    logger.info("Temporary user created for seller OTP verification", {
      userId: user._id,
      mobile,
    });
  } else {
    // Existing user (maybe buyer) - just update OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save({ validateBeforeSave: false });
    logger.info("OTP sent to existing user for seller registration", {
      userId: user._id,
      mobile,
      currentRoles: user.role,
    });
  }

  // Send SMS
  const smsResult = await sendOTPSMS(mobile, otp);

  if (!smsResult.success) {
    return next(new AppError("Failed to send OTP. Please try again", 500));
  }

  logger.info("OTP sent successfully for seller registration", {
    mobile,
    userId: user._id,
  });

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    otpExpiresAt: otpExpires,
  });
});

// ======================== VERIFY OTP ========================
export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return next(new AppError("Mobile and OTP are required", 400));
  }

  const user = await User.findOne({ mobile }).select("+otp +otpExpires");

  if (!user) {
    return next(new AppError("User not found. Please send OTP first", 404));
  }

  // Verify OTP using model method (constant-time comparison)
  const verification = user.verifyOtp(otp);

  if (!verification.valid) {
    logger.warn("Seller OTP verification failed", {
      mobile,
      userId: user._id,
      reason: verification.message,
    });
    return next(new AppError(verification.message, 400));
  }

  // Mark mobile as verified
  user.isMobileVerified = true;
  await user.clearOtp();
  await user.save({ validateBeforeSave: false });

  logger.info("Mobile verified successfully for seller registration", {
    mobile,
    userId: user._id,
  });

  res.status(200).json({
    success: true,
    message: "Mobile verified successfully",
    userId: user._id,
  });
});

// ======================== CHECK UNIQUE SELLER ========================
export const checkUniqueSeller = asyncHandler(async (req, res, next) => {
  const { email, mobile, businessId, seller_status, seller_country } = req.body;

  // ✅ Validate email format
  if (email && !isValidEmail(email)) {
    return next(new AppError("Invalid email format", 400));
  }

  // ✅ Get country with proper priority: IP detection > user input > fallback
  const country = req.detectedCountry || seller_country || "IN";

  logger.info("Country detection for seller registration", {
    detectedCountry: req.detectedCountry,
    providedCountry: seller_country,
    finalCountry: country,
  });

  // ✅ Validate business ID for professional sellers
  if (seller_status === "professional") {
    if (!businessId) {
      return next(
        new AppError("Business ID is required for professional sellers", 400)
      );
    }

    const validation = validateBusinessIdByCountry(businessId, country);
    if (!validation.isValid) {
      return next(new AppError(validation.message, 400));
    }
  }

  // Check if user exists and mobile is verified
  const user = await User.findByMobile(mobile);

  if (!user) {
    return next(new AppError("Mobile not found. Please verify OTP first", 400));
  }

  if (!user.isMobileVerified) {
    return next(new AppError("Mobile not verified. Please verify OTP", 400));
  }

  // Check if already a seller
  if (user.hasRole("seller")) {
    return next(new AppError("Already registered as seller", 409));
  }

  // ✅ FIX: Don't check or reject email mismatch - user might want different email for seller
  // Just check if the NEW email is taken by someone else
  if (email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      return next(
        new AppError("Email already registered by another user", 409)
      );
    }
  }

  // Check business ID uniqueness for professional sellers
  if (seller_status === "professional" && businessId) {
    const existingSeller = await Seller.findOne({
      seller_company_number: businessId,
    });
    if (existingSeller) {
      return next(new AppError("Business ID already registered", 409));
    }
  }

  logger.info("Seller uniqueness check passed", {
    userId: user._id,
    email,
    mobile,
    businessId,
    country,
  });

  res.status(200).json({
    success: true,
    message: "Validation successful",
    data: {
      country, // Return detected country to frontend
      hasExistingEmail: !!user.email,
      hasExistingPassword: user.hasPassword,
    },
  });
});

// ======================== REGISTER SELLER (WITH TRANSACTIONS) ========================
export const registerSeller = asyncHandler(async (req, res, next) => {
  const {
    email,
    mobile,
    businessId,
    password,
    sellername,
    businessName,
    companyregstartionlocation,
    seller_status,
    seller_address,
    seller_country,
  } = req.body;

  // ======================== VALIDATION ========================
  if (!email || !isValidEmail(email)) {
    return next(new AppError("Valid email is required", 400));
  }

  if (!mobile || !isValidMobile(mobile)) {
    return next(new AppError("Valid mobile number is required", 400));
  }

  // ✅ FIX: Only require password if user doesn't have one
  let user = await User.findByMobile(mobile); // ✅ Changed to let for reassignment
  if (!user) {
    return next(new AppError("User not found. Please verify OTP first", 400));
  }

  if (!user.isMobileVerified) {
    return next(new AppError("Mobile not verified. Please verify OTP", 400));
  }

  // Only validate password if user doesn't have one already
  if (!user.hasPassword) {
    if (!password || password.length < 6) {
      return next(
        new AppError("Password must be at least 6 characters long", 400)
      );
    }
  }

  if (!sellername || sellername.trim().length < 2) {
    return next(new AppError("Seller name is required", 400));
  }

  if (!/^[a-zA-Z\s]+$/.test(sellername)) {
    return next(
      new AppError("Seller name can only contain letters and spaces", 400)
    );
  }

  if (
    !seller_status ||
    !["professional", "individual"].includes(seller_status.toLowerCase())
  ) {
    return next(new AppError("Valid seller status is required", 400));
  }

  if (!seller_address || seller_address.trim().length < 10) {
    return next(
      new AppError("Seller address is required (min 10 characters)", 400)
    );
  }

  // ✅ Country priority: IP detection > user input > fallback
  const country = req.detectedCountry || seller_country || "IN";

  if (!country || country.trim().length < 2) {
    return next(new AppError("Seller country is required", 400));
  }

  const isProfessional = seller_status.toLowerCase() === "professional";

  // Professional seller validations
  if (isProfessional) {
    const validation = validateBusinessIdByCountry(businessId, country);
    if (!validation.isValid) {
      return next(new AppError(validation.message, 400));
    }

    if (!businessName || businessName.trim().length < 2) {
      return next(
        new AppError("Business name is required for professional sellers", 400)
      );
    }

    if (
      !companyregstartionlocation ||
      companyregstartionlocation.trim().length < 2
    ) {
      return next(
        new AppError(
          "Company registration location is required for professional sellers",
          400
        )
      );
    }

    const file = req.files?.file?.[0];
    if (!file) {
      return next(
        new AppError(
          "Business document is required for professional sellers",
          400
        )
      );
    }

    const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!acceptedTypes.includes(file.mimetype)) {
      return next(
        new AppError("Invalid file type. Only JPG, PNG, and PDF allowed", 400)
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return next(new AppError("File size exceeds 5MB", 400));
    }
  }

  // ======================== CHECK DUPLICATES ========================
  if (user.hasRole("seller")) {
    return next(new AppError("Already registered as seller", 400));
  }

  // ✅ FIX: Allow different email, just check it's not taken by others
  if (email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      return next(
        new AppError("Email already registered by another user", 409)
      );
    }
  }

  if (isProfessional) {
    const existingSeller = await Seller.findOne({
      seller_company_number: businessId,
    });
    if (existingSeller) {
      return next(new AppError("Business ID already registered", 409));
    }
  }

  // ======================== UPLOAD FILES ========================
  let documentUrl = null;
  let profileUrl = null;

  if (isProfessional) {
    const file = req.files?.file?.[0];
    const uploadResult = await uploadOnCloudinary(file.path);
    documentUrl = uploadResult?.secure_url;
    if (!documentUrl) {
      return next(new AppError("Failed to upload document", 500));
    }
  }

  if (req.files?.seller_profile?.[0]) {
    const profileFile = req.files.seller_profile[0];
    const profileUpload = await uploadOnCloudinary(profileFile.path);
    profileUrl = profileUpload?.secure_url;
  }

  // ======================== TRANSACTION: CREATE SELLER + UPDATE USER ========================
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ FIX: Load user in transaction and modify document directly
    let transactionUser = await User.findById(user._id).session(session);
    if (!transactionUser) {
      throw new Error("User not found");
    }

    let userModified = false;

    // Update email only if different
    if (!transactionUser.email || email !== transactionUser.email) {
      transactionUser.email = email;
      userModified = true;
    }

    // ✅ CRITICAL: Set password on document to trigger pre-save hash
    if (!transactionUser.hasPassword && password) {
      transactionUser.password = password; // Pre-save hook will hash this
      userModified = true;
    }

    // Update name if not set
    if (!transactionUser.name) {
      transactionUser.name = sellername.trim();
      userModified = true;
    }

    // Save user if modified (triggers password hashing)
    if (userModified) {
      await transactionUser.save({ session });
      logger.info("User updated with seller details", {
        userId: transactionUser._id,
        hasPassword: transactionUser.hasPassword,
        passwordSet: !!password,
      });
    }

    // ✅ Prepare seller data
    const sellerData = {
      userId: user._id,
      seller_name: sellername.trim(),
      seller_status: seller_status.toLowerCase(),
      seller_company_number: isProfessional ? businessId : null,
      seller_address: seller_address.trim(),
      seller_country: country,
      seller_email: email,
      seller_phone: mobile,
      seller_profile_url: profileUrl,
      varificationStatus: "Pending",
      status: "active",
    };

    // ✅ Create seller and sync user role/sellerProfile
    const seller = new Seller(sellerData);
    await seller.save({ session });

    // ✅ Update User with seller reference and role
    await User.findByIdAndUpdate(
      user._id,
      {
        $set: { sellerProfile: seller._id },
        $addToSet: { role: "seller" },
      },
      { session }
    );

    // ✅ Reload user to get final state
    const finalUser = await User.findById(user._id).session(session);

    logger.info("Seller created successfully with User sync", {
      userId: finalUser._id,
      sellerId: seller._id,
      seller_status: seller.seller_status,
      seller_country: seller.seller_country,
      roles: finalUser.role,
    });

    // ✅ Create company for professional sellers
    let company = null;
    if (isProfessional) {
      company = new Company({
        sellerId: seller._id,
        companyBasicInfo: {
          companyName: businessName.trim(),
          company_registration_number: businessId,
          locationOfRegistration: companyregstartionlocation.trim(),
          registration_documents: [documentUrl],
        },
      });

      // ✅ Save with session - pre-save hook will use it
      await company.save({ session });

      // Update Seller with company reference
      await Seller.findByIdAndUpdate(
        seller._id,
        { $set: { companyId: company._id } },
        { session }
      );

      logger.info("Company created successfully with Seller sync", {
        sellerId: seller._id,
        companyId: company._id,
      });
    }

    // ✅ Commit transaction
    await session.commitTransaction();
    logger.info("Seller registration transaction committed successfully", {
      userId: user._id,
      sellerId: seller._id,
      companyId: company?._id,
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: isProfessional
        ? "Professional seller registration successful"
        : "Individual seller registration successful",
      data: {
        userId: user._id,
        sellerId: seller._id,
        companyId: company?._id || null,
        seller_status: seller.seller_status,
        seller_country: seller.seller_country,
        roles: finalUser.role,
        varificationStatus: seller.varificationStatus,
      },
      nextRoute: "/seller/login",
    });
  } catch (error) {
    // ✅ Rollback transaction on error
    await session.abortTransaction();
    logger.error("Seller registration transaction failed", {
      error: error.message,
      mobile,
      email,
    });

    // Handle specific errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return next(
        new AppError(`${field} already exists. Please use a different one`, 409)
      );
    }

    return next(
      new AppError(
        error.message || "Failed to register seller. Please try again",
        500
      )
    );
  } finally {
    session.endSession();
  }
});

// ======================== LOGIN SELLER ========================
export const loginSeller = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier) {
    return next(new AppError("Email or Mobile is required", 400));
  }
  if (!password) {
    return next(new AppError("Password is required", 400));
  }

  const user = await User.findByIdentifierWithAuth(identifier);

  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  if (!user.hasRole("seller")) {
    return next(new AppError("Not a seller account", 403));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  if (user.isLocked()) {
    return next(new AppError("Account is temporarily locked", 423));
  }

  logger.info("Seller logged in successfully", {
    userId: user._id,
    email: user.email,
  });

  await sendToken(user, 200, res, "Login successful");
});

// ======================== LOAD SELLER ========================
export const loadSeller = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const seller = await Seller.findOne({ userId }).lean();

  if (!seller) {
    return next(
      new AppError(
        "Seller profile not found. Please complete registration",
        404
      )
    );
  }

  // Check seller status
  if (seller.status === "suspended") {
    return next(new AppError("Your seller account has been suspended", 403));
  }

  if (seller.status === "inactive") {
    return next(new AppError("Your seller account is inactive", 403));
  }

  // Get user data separately
  const user = await User.findById(userId).select(
    "name email mobile role isEmailVerified isMobileVerified status hasPassword lastLogin"
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // ✅ FIX: Update last login with await
  await user.updateLastLogin();

  // Build response
  const responseData = {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      status: user.status,
      hasPassword: user.hasPassword,
      lastLogin: user.lastLogin,
    },
    seller: {
      id: seller._id,
      seller_name: seller.seller_name,
      seller_status: seller.seller_status,
      seller_company_number: seller.seller_company_number,
      seller_address: seller.seller_address,
      seller_country: seller.seller_country,
      seller_email: seller.seller_email,
      seller_phone: seller.seller_phone,
      seller_profile_url: seller.seller_profile_url,
      varificationStatus: seller.varificationStatus,
      status: seller.status,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    },
    permissions: {
      canCreateProduct: seller.varificationStatus === "Approved",
      canManageOrders: seller.varificationStatus === "Approved",
      needsVerification: seller.varificationStatus === "Pending",
      isRejected: seller.varificationStatus === "Rejected",
      isProfessional: seller.seller_status === "professional",
      isIndividual: seller.seller_status === "individual",
    },
  };

  logger.info("Seller loaded successfully", {
    userId: user._id,
    sellerId: seller._id,
  });

  res.status(200).json({
    success: true,
    message: "Seller loaded successfully",
    data: responseData,
  });
});

// ======================== LOGOUT SELLER ========================
export const logoutSeller = asyncHandler(async (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  logger.info("Seller logged out", { userId: req.user?.id });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// ======================== UPDATE SELLER PROFILE ========================
export const updateSellerProfile = asyncHandler(async (req, res, next) => {
  // TODO: Implement seller profile update logic
  res.status(501).json({
    success: false,
    message: "Update seller profile endpoint not yet implemented",
  });
});
