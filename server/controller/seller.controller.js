import User from "../models/user.model.js";
import Seller from "../models/sellerSingnup.model.js";
import CompanyDetails from "../models/company.model.js";
import asyncHandler from "../middleware/buyer/asyncHandler.js";
import AppError from "../utils/buyer/AppError.js";
import sendToken from "../utils/buyer/sendToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { generateOTP, getOTPExpiry } from "../utils/buyer/otpUtils.js";
import { sendOTPSMS } from "../utils/buyer/sendNumberbyTwilio.js";
import logger from "../config/winston.js";
import jwt from "jsonwebtoken";

// ======================== VALIDATORS ========================
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidMobile = (mobile) => /^[+]?[1-9]\d{1,14}$/.test(mobile);
const isValidGSTIN = (businessId) =>
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(businessId);

// ======================== SEND OTP ========================
export const sendOtp = asyncHandler(async (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile) {
    return next(new AppError("Mobile number is required", 400));
  }

  // ✅ Check if user exists
  let user = await User.findByMobile(mobile);

  // ✅ If user exists and already has seller role → Block registration
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

    logger.info("Temporary user created for seller OTP", {
      userId: user._id,
      mobile,
    });
  } else {
    // ✅ Update existing user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    logger.info("OTP updated for existing user (seller registration)", {
      userId: user._id,
      mobile,
    });
  }

  // ✅ Send OTP via SMS
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
  });
});

// ======================== VERIFY OTP ========================
export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { mobile, otp } = req.body;

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
    logger.warn("Seller OTP verification failed", {
      mobile,
      reason: verification.message,
    });
    return next(new AppError(verification.message, 400));
  }

  // ✅ Mark mobile as verified
  user.isMobileVerified = true;
  await user.clearOtp(); // Clear OTP fields
  await user.save();

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
  const { email, mobile, businessId, seller_status } = req.body;

  // Validation
  if (email && !isValidEmail(email)) {
    return next(new AppError("Invalid email format", 400));
  }

  // ✅ Only validate GSTIN if professional seller
  if (seller_status === "professional") {
    if (!businessId) {
      return next(
        new AppError("Business ID is required for professional sellers", 400)
      );
    }
    if (!isValidGSTIN(businessId)) {
      return next(new AppError("Invalid GSTIN format", 400));
    }
  }

  // ✅ Find user by mobile (must exist & be verified)
  const user = await User.findByMobile(mobile);

  if (!user) {
    return next(new AppError("Mobile not found. Please verify OTP first", 400));
  }

  if (!user.isMobileVerified) {
    return next(new AppError("Mobile not verified. Please verify OTP", 400));
  }

  // ✅ Check if already seller
  if (user.hasRole("seller")) {
    return next(new AppError("Already registered as seller", 409));
  }

  // ✅ Check email uniqueness (if email is different from user's current email)
  if (email && email !== user.email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      return next(new AppError("Email already exists", 409));
    }
  }

  // ✅ Check businessId in Seller collection (only for professional)
  if (seller_status === "professional" && businessId) {
    const existingSeller = await Seller.findOne({
      seller_company_number: businessId,
    });
    if (existingSeller) {
      return next(new AppError("GSTIN already registered", 409));
    }
  }

  logger.info("Seller uniqueness check passed", { email, mobile, businessId });

  res.status(200).json({
    success: true,
    message: "Validation successful",
  });
});

// ======================== REGISTER SELLER ========================
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

  // ========== COMMON VALIDATIONS ==========
  if (!email || !isValidEmail(email)) {
    return next(new AppError("Valid email is required", 400));
  }

  if (!password || password.length < 6) {
    return next(
      new AppError("Password must be at least 6 characters long", 400)
    );
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

  if (!seller_country || seller_country.trim().length < 2) {
    return next(new AppError("Seller country is required", 400));
  }

  // ========== PROFESSIONAL SELLER VALIDATIONS ==========
  const isProfessional = seller_status.toLowerCase() === "professional";

  if (isProfessional) {
    // Validate businessId (GSTIN)
    if (!businessId || !isValidGSTIN(businessId)) {
      return next(
        new AppError("Valid GSTIN is required for professional sellers", 400)
      );
    }

    // Validate businessName
    if (!businessName || businessName.trim().length < 2) {
      return next(
        new AppError("Business name is required for professional sellers", 400)
      );
    }

    // Validate company registration location
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

    // Validate document upload
    const file = req.file;
    if (!file) {
      return next(
        new AppError("GSTIN document is required for professional sellers", 400)
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

  // ========== FIND USER BY MOBILE ==========
  const user = await User.findByMobile(mobile);

  if (!user) {
    return next(new AppError("Mobile not found. Please verify OTP first", 400));
  }

  // ========== CHECK IF MOBILE VERIFIED ==========
  if (!user.isMobileVerified) {
    return next(
      new AppError("Mobile not verified. Please verify OTP first", 400)
    );
  }

  // ========== CHECK IF ALREADY SELLER ==========
  if (user.hasRole("seller")) {
    return next(new AppError("Already registered as seller", 400));
  }

  // ========== CHECK EMAIL UNIQUE (if different from existing) ==========
  if (email && email !== user.email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      return next(new AppError("Email already exists", 409));
    }
  }

  // ========== CHECK GSTIN UNIQUE (only for professional) ==========
  if (isProfessional) {
    const existingSeller = await Seller.findOne({
      seller_company_number: businessId,
    });
    if (existingSeller) {
      return next(new AppError("GSTIN already registered", 409));
    }
  }

  // ========== UPLOAD DOCUMENT (only for professional) ==========
  let documentUrl = null;
  if (isProfessional) {
    const file = req.file;
    const uploadResult = await uploadOnCloudinary(file.path);
    documentUrl = uploadResult?.secure_url;
    if (!documentUrl) {
      return next(new AppError("Failed to upload document", 500));
    }
  }

  // ========== UPDATE USER ROLES ==========
  const hasBuyerRole = user.hasRole("buyer");

  if (!hasBuyerRole) {
    // Direct seller registration → Give both buyer + seller role
    user.role = [...new Set([...user.role, "buyer", "seller"])];
    logger.info("User registered as seller (with auto buyer role)", {
      userId: user._id,
      previousRoles: user.role,
    });
  } else {
    // Already buyer → Just add seller role
    user.role = [...new Set([...user.role, "seller"])];
    logger.info("Existing buyer upgraded to seller", {
      userId: user._id,
      previousRoles: user.role,
    });
  }

  // ========== UPDATE USER WITH COMPLETE DETAILS ==========
  user.email = email;
  user.password = password; // Will be hashed by pre-save hook
  user.name = sellername;
  await user.save();

  logger.info("User updated with seller details", { userId: user._id });

  // ========== CREATE SELLER DOCUMENT ==========
  const seller = await Seller.create({
    userId: user._id,
    seller_name: sellername,
    seller_status: seller_status.toLowerCase(),
    seller_company_number: isProfessional ? businessId : null, // ✅ NULL for individual
    seller_address,
    seller_country: seller_country || "India",
    seller_email: email,
    seller_phone: mobile,
    varificationStatus: "Pending",
    status: "active",
  });

  logger.info("Seller created successfully", {
    userId: user._id,
    sellerId: seller._id,
    seller_status: seller.seller_status,
    roles: user.role,
  });

  // ========== CREATE COMPANY (only for professional) ==========
  let company = null;
  if (isProfessional) {
    // Parse address from seller_address (basic parsing)

    company = await CompanyDetails.create({
      sellerId: seller._id,
      companyBasicInfo: {
        companyName: businessName,
        company_registration_number: businessId,
        locationOfRegistration: companyregstartionlocation,
        registration_documents: [documentUrl],
      },
    });

    logger.info("Company created successfully", {
      sellerId: seller._id,
      companyId: company._id,
    });
  }

  // ========== SEND RESPONSE ==========
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
      roles: user.role,
    },
    nextRoute: "/login",
  });
});

// ======================== LOGIN SELLER ========================
export const loginSeller = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body;

  // Validations
  if (!identifier) {
    return next(new AppError("Email or Mobile is required", 400));
  }
  if (!password) {
    return next(new AppError("Password is required", 400));
  }

  // ========== FIND USER (not Seller!) ==========
  const user = await User.findByIdentifierWithAuth(identifier);

  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  // ========== CHECK IF USER HAS SELLER ROLE ==========
  if (!user.hasRole("seller")) {
    return next(new AppError("Not a seller account", 403));
  }

  // ========== VERIFY PASSWORD ==========
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  // ========== CHECK IF ACCOUNT IS LOCKED ==========
  if (user.isLocked()) {
    return next(new AppError("Account is temporarily locked", 423));
  }

  logger.info("Seller logged in successfully", {
    userId: user._id,
    email: user.email,
  });

  // ========== SEND TOKEN ==========
  sendToken(user, 200, res, "Login successful");
});

// ======================== GET SELLER PROFILE ========================
export const getSellerProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // From auth middleware

  // ✅ Find seller by userId
  const seller = await Seller.findOne({ userId }).populate(
    "userId",
    "name email mobile role isMobileVerified isEmailVerified"
  );

  if (!seller) {
    return next(new AppError("Seller not found", 404));
  }

  // ✅ If professional, fetch company details
  let company = null;
  if (seller.seller_status === "professional") {
    company = await CompanyDetails.findOne({ sellerId: seller._id });
  }

  logger.info("Seller profile retrieved", { userId, sellerId: seller._id });

  res.status(200).json({
    success: true,
    data: {
      seller,
      company,
    },
  });
});

// ======================== REFRESH TOKEN ========================
export const refreshTokenController = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new AppError("No refresh token provided", 401));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const newAccessToken = user.getAccessToken();

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    logger.info("Access token refreshed", { userId: user._id });

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return next(new AppError("Invalid or expired refresh token", 403));
  }
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

  logger.info("Seller logged out");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});
