import User from "../../models/user.model.js";
import Seller from "../../models/sellerSingnup.model.js";
import CompanyDetails from "../../models/company.model.js";
import asyncHandler from "../../middleware/buyer/asyncHandler.js";
import AppError from "../../utils/buyer/AppError.js";
import sendToken from "../../utils/buyer/sendToken.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.utils.js";
import { generateOTP, getOTPExpiry } from "../../utils/buyer/otpUtils.js";
import { sendOTPSMS } from "../../utils/buyer/sendNumberbyTwilio.js";
import logger from "../../config/winston.js";
import jwt from "jsonwebtoken";
import { validateBusinessIdByCountry } from "../../utils/buyer/country.utils.js";

// ======================== VALIDATORS ========================
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidMobile = (mobile) => /^[+]?[1-9]\d{1,14}$/.test(mobile);

// ❌ REMOVED: isValidGSTIN (replaced with country-specific validation)

// ======================== SEND OTP ========================
export const sendOtp = asyncHandler(async (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile) {
    return next(new AppError("Mobile number is required", 400));
  }

  let user = await User.findByMobile(mobile);

  if (user && user.hasRole("seller")) {
    return next(new AppError("Mobile already registered as seller", 409));
  }

  const otp = generateOTP();
  const otpExpires = getOTPExpiry();

  if (!user) {
    user = await User.create({
      mobile,
      otp,
      otpExpires,
      isMobileVerified: false,
      role: ["user"],
    });
    logger.info("Temporary user created for seller OTP", {
      userId: user._id,
      mobile,
    });
  } else {
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    logger.info("OTP updated for existing user (seller registration)", {
      userId: user._id,
      mobile,
    });
  }

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

  const user = await User.findOne({ mobile }).select("+otp +otpExpires");

  if (!user) {
    return next(new AppError("User not found. Please send OTP first", 404));
  }

  const verification = user.verifyOtp(otp);

  if (!verification.valid) {
    logger.warn("Seller OTP verification failed", {
      mobile,
      reason: verification.message,
    });
    return next(new AppError(verification.message, 400));
  }

  user.isMobileVerified = true;
  await user.clearOtp();
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
  const { email, mobile, businessId, seller_status, seller_country } = req.body; // ✅ ADDED seller_country

  if (email && !isValidEmail(email)) {
    return next(new AppError("Invalid email format", 400));
  }

  // ✅ NEW: Get country from body OR detected IP (fallback chain)
  const country = seller_country || req.detectedCountry || "IN";

  if (seller_status === "professional") {
    if (!businessId) {
      return next(
        new AppError("Business ID is required for professional sellers", 400)
      );
    }

    // ✅ UPDATED: Use country-specific validation
    const validation = validateBusinessIdByCountry(businessId, country);
    if (!validation.isValid) {
      return next(new AppError(validation.message, 400));
    }
  }

  const user = await User.findByMobile(mobile);

  if (!user) {
    return next(new AppError("Mobile not found. Please verify OTP first", 400));
  }

  if (!user.isMobileVerified) {
    return next(new AppError("Mobile not verified. Please verify OTP", 400));
  }

  if (user.hasRole("seller")) {
    return next(new AppError("Already registered as seller", 409));
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      return next(new AppError("Email already exists", 409));
    }
  }

  if (seller_status === "professional" && businessId) {
    const existingSeller = await Seller.findOne({
      seller_company_number: businessId,
    });
    if (existingSeller) {
      return next(new AppError("Business ID already registered", 409));
    }
  }

  logger.info("Seller uniqueness check passed", {
    email,
    mobile,
    businessId,
    country, // ✅ Log country
  });

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
    seller_country, // ✅ ADDED
  } = req.body;

  // Validations
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

  // ✅ NEW: Get country with fallback chain
  const country = seller_country || req.detectedCountry || "IN";

  if (!country || country.trim().length < 2) {
    return next(new AppError("Seller country is required", 400));
  }

  const isProfessional = seller_status.toLowerCase() === "professional";

  if (isProfessional) {
    // ✅ UPDATED: Use country-specific validation
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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return next(new AppError("File size exceeds 5MB", 400));
    }
  }

  const user = await User.findByMobile(mobile);

  if (!user) {
    return next(new AppError("Mobile not found. Please verify OTP first", 400));
  }

  if (!user.isMobileVerified) {
    return next(
      new AppError("Mobile not verified. Please verify OTP first", 400)
    );
  }

  if (user.hasRole("seller")) {
    return next(new AppError("Already registered as seller", 400));
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      return next(new AppError("Email already exists", 409));
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

  // Upload documents
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

  // Update user roles
  const hasBuyerRole = user.hasRole("buyer");

  if (!hasBuyerRole) {
    user.role = [...new Set([...user.role, "buyer", "seller"])];
    logger.info("User registered as seller (with auto buyer role)", {
      userId: user._id,
    });
  } else {
    user.role = [...new Set([...user.role, "seller"])];
    logger.info("Existing buyer upgraded to seller", { userId: user._id });
  }

  user.email = email;
  user.password = password;
  user.name = sellername;
  await user.save();

  logger.info("User updated with seller details", { userId: user._id });

  // Create seller
  const seller = await Seller.create({
    userId: user._id,
    seller_name: sellername,
    seller_status: seller_status.toLowerCase(),
    seller_company_number: isProfessional ? businessId : null,
    seller_address,
    seller_country: country, // ✅ Use detected/provided country
    seller_email: email,
    seller_phone: mobile,
    seller_profile_url: profileUrl,
    varificationStatus: "Pending",
    status: "active",
  });

  logger.info("Seller created successfully", {
    userId: user._id,
    sellerId: seller._id,
    seller_status: seller.seller_status,
    seller_country: seller.seller_country, // ✅ Log country
    roles: user.role,
  });

  // Create company (only for professional)
  let company = null;
  if (isProfessional) {
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
      seller_country: seller.seller_country, // ✅ Return country
      roles: user.role,
    },
    nextRoute: "/login",
  });
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
  console.log("this is user", user);
  sendToken(user, 200, res, "Login successful");
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

  // ✅ FIX: Convert RegEx to string in seller_country
  if (seller?.seller_country?.businessIdConfig?.pattern) {
    const pattern = seller.seller_country.businessIdConfig.pattern;
    seller.seller_country.businessIdConfig.pattern =
      pattern instanceof RegExp ? pattern.source : String(pattern);
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

  // Update last login
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

  logger.info("Seller logged out");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// ======================== UPDATE SELLER PROFILE ========================
export const updateSellerProfile = asyncHandler(async (req, res, next) => {});
