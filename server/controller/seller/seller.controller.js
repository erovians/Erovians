import User from "../../models/user.model.js";
import Seller from "../../models/sellerSingnup.model.js";
import CompanyDetails from "../../models/company.model.js";
import asyncHandler from "../../middleware/buyer/asyncHandler.js";
import AppError from "../../utils/buyer/AppError.js";
import sendToken from "../../utils/buyer/sendToken.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.utils.js";
import { sendOTPSMS } from "../../utils/buyer/sendNumberbyTwilio.js";
import logger from "../../config/winston.js";
import { validateBusinessIdByCountry } from "../../utils/buyer/country.utils.js";
import {
  generateOTP,
  storeOTP,
  verifyOTP as verifyOTPRedis,
  isVerified,
  markAsRegistered,
} from "../../services/otp.service.js";
import mongoose from "mongoose";

// ======================== VALIDATORS ========================
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidMobile = (mobile) => /^[+]?[1-9]\d{1,14}$/.test(mobile);

// ======================== SEND OTP ========================
export const sendOtp = asyncHandler(async (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile || !isValidMobile(mobile)) {
    return next(new AppError("Valid mobile number is required", 400));
  }

  // Check if mobile already registered as seller
  const existingUser = await User.findByMobile(mobile);
  if (existingUser && existingUser.hasRole("seller")) {
    return next(new AppError("Mobile already registered as seller", 409));
  }

  // Generate OTP
  const otp = generateOTP();

  // Store in Redis
  const storeResult = await storeOTP(mobile, otp);
  if (!storeResult.success) {
    return next(new AppError(storeResult.message, 429));
  }

  // Send OTP via SMS
  const smsResult = await sendOTPSMS(mobile, otp);
  if (!smsResult.success) {
    return next(new AppError("Failed to send OTP. Please try again", 500));
  }

  logger.info("OTP sent successfully for seller registration", { mobile });

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    expiresIn: storeResult.expiresIn,
  });
});

// ======================== VERIFY OTP ========================
export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return next(new AppError("Mobile and OTP are required", 400));
  }

  if (!/^\d{6}$/.test(otp)) {
    return next(new AppError("Invalid OTP format", 400));
  }

  // Verify OTP from Redis
  const verification = await verifyOTPRedis(mobile, otp);

  if (!verification.valid) {
    logger.warn("Seller OTP verification failed", {
      mobile,
      reason: verification.message,
    });
    return next(new AppError(verification.message, 400));
  }

  logger.info("Mobile verified successfully for seller registration", {
    mobile,
  });

  res.status(200).json({
    success: true,
    message: "Mobile verified successfully",
  });
});

// ======================== CHECK UNIQUE SELLER ========================
export const checkUniqueSeller = asyncHandler(async (req, res, next) => {
  const { email, mobile, businessId, seller_status, seller_country } = req.body;

  // Validate mobile
  if (!mobile || !isValidMobile(mobile)) {
    return next(new AppError("Valid mobile number is required", 400));
  }

  // Validate email if provided
  if (email && !isValidEmail(email)) {
    return next(new AppError("Invalid email format", 400));
  }

  // Get country from IP or body (IP priority)
  const country = req.detectedCountry || seller_country || "IN";

  // Validate professional seller requirements
  if (seller_status === "professional") {
    if (!businessId) {
      return next(
        new AppError("Business ID is required for professional sellers", 400)
      );
    }

    // Country-specific business ID validation
    const validation = validateBusinessIdByCountry(businessId, country);
    if (!validation.isValid) {
      return next(new AppError(validation.message, 400));
    }
  }

  // Check if mobile already has seller role
  const user = await User.findByMobile(mobile);
  if (user && user.hasRole("seller")) {
    return next(new AppError("Already registered as seller", 409));
  }

  // Check email uniqueness (if different from existing user's email)
  if (email && user && user.email && user.email !== email) {
    const emailExists = await User.findByEmail(email);
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      return next(new AppError("Email already exists", 409));
    }
  }

  // Check business ID uniqueness
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
    country,
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
    seller_country,
  } = req.body;

  // ========== VALIDATIONS ==========
  if (!mobile || !isValidMobile(mobile)) {
    return next(new AppError("Valid mobile number is required", 400));
  }

  if (email && !isValidEmail(email)) {
    return next(new AppError("Valid email is required", 400));
  }

  if (!password || password.length < 6) {
    return next(
      new AppError("Password must be at least 6 characters long", 400)
    );
  }

  if (!sellername || sellername.trim().length < 2) {
    return next(
      new AppError("Seller name is required (min 2 characters)", 400)
    );
  }

  if (!/^[a-zA-Z\s]+$/.test(sellername.trim())) {
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

  // Get country with IP priority
  const country = req.detectedCountry || seller_country || "IN";

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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return next(new AppError("File size exceeds 5MB", 400));
    }
  }

  // ========== CHECK USER OR CREATE IF VERIFIED ==========
  let user = await User.findByMobile(mobile);

  if (!user) {
    // ✅ FIX: Check if verified in Redis
    const verified = await isVerified(mobile);
    if (!verified) {
      return next(
        new AppError(
          "Mobile not verified. Please verify OTP first using /verify-otp",
          400
        )
      );
    }

    // ✅ FIX: Create User if verified in Redis but not in DB
    user = await User.create({
      mobile,
      isMobileVerified: true,
      role: ["user"],
      status: "active",
    });

    logger.info("User created during seller registration", {
      userId: user._id,
      mobile,
    });
  } else {
    // User exists - check if mobile is verified
    if (!user.isMobileVerified) {
      return next(
        new AppError("Mobile not verified. Please verify OTP first", 400)
      );
    }
  }

  // Check if already a seller
  if (user.hasRole("seller")) {
    return next(new AppError("Already registered as seller", 409));
  }

  // Check email conflict
  if (email) {
    if (user.email && user.email !== email) {
      const emailExists = await User.findByEmail(email);
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return next(new AppError("Email already exists", 409));
      }
    }
  }

  // Check business ID conflict
  if (isProfessional) {
    const existingSeller = await Seller.findOne({
      seller_company_number: businessId,
    });
    if (existingSeller) {
      return next(new AppError("Business ID already registered", 409));
    }
  }

  // ========== UPLOAD DOCUMENTS ==========
  let documentUrl = null;
  let profileUrl = null;

  if (isProfessional) {
    const file = req.files?.file?.[0];
    const uploadResult = await uploadOnCloudinary(file.path, file.mimetype);
    documentUrl = uploadResult?.secure_url;
    if (!documentUrl) {
      return next(new AppError("Failed to upload document", 500));
    }
  }

  if (req.files?.seller_profile?.[0]) {
    const profileFile = req.files.seller_profile[0];
    const profileUpload = await uploadOnCloudinary(
      profileFile.path,
      profileFile.mimetype
    );
    profileUrl = profileUpload?.secure_url;
  }

  // ========== TRANSACTION FOR PROFESSIONAL SELLERS ==========
  if (isProfessional) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update User (sync email + password only if not set)
      if (!user.email) {
        user.email = email;
      }
      if (!user.hasPassword) {
        user.password = password;
      }
      if (!user.name) {
        user.name = sellername.trim();
      }

      // Add roles
      if (!user.hasRole("buyer")) {
        await user.addRole("buyer");
      }
      await user.addRole("seller");

      await user.save({ session });

      // Create Seller
      const seller = await Seller.create(
        [
          {
            userId: user._id,
            seller_name: sellername.trim(),
            seller_status: "professional",
            seller_company_number: businessId,
            seller_address: seller_address.trim(),
            seller_country: country,
            seller_email: email || user.email,
            seller_phone: mobile,
            seller_profile_url: profileUrl,
            varificationStatus: "Pending",
            status: "active",
          },
        ],
        { session }
      );

      // Update User.sellerProfile reference
      user.sellerProfile = seller[0]._id;
      await user.save({ session });

      // Create Company
      const company = await CompanyDetails.create(
        [
          {
            sellerId: seller[0]._id,
            companyBasicInfo: {
              companyName: businessName.trim(),
              company_registration_number: businessId,
              locationOfRegistration: companyregstartionlocation.trim(),
              registration_documents: [documentUrl],
            },
          },
        ],
        { session }
      );

      // Update Seller.companyId reference
      seller[0].companyId = company[0]._id;
      await seller[0].save({ session });

      await session.commitTransaction();

      // ✅ FIX: Delete verified flag from Redis after successful registration
      await markAsRegistered(mobile);

      logger.info("Professional seller registered successfully", {
        userId: user._id,
        sellerId: seller[0]._id,
        companyId: company[0]._id,
      });

      res.status(201).json({
        success: true,
        message: "Professional seller registration successful",
        data: {
          userId: user._id,
          sellerId: seller[0]._id,
          companyId: company[0]._id,
          seller_status: "professional",
          seller_country: country,
          roles: user.role,
        },
        nextRoute: "/login",
      });
    } catch (error) {
      await session.abortTransaction();
      logger.error("Professional seller registration failed", {
        error: error.message,
      });
      return next(
        new AppError(
          `Registration failed: ${error.message || "Transaction error"}`,
          500
        )
      );
    } finally {
      session.endSession();
    }
  } else {
    // ========== INDIVIDUAL SELLER (NO TRANSACTION NEEDED) ==========
    try {
      // Update User (sync email + password only if not set)
      if (!user.email) {
        user.email = email;
      }
      if (!user.hasPassword) {
        user.password = password;
      }
      if (!user.name) {
        user.name = sellername.trim();
      }

      // Add roles
      if (!user.hasRole("buyer")) {
        await user.addRole("buyer");
      }
      await user.addRole("seller");

      await user.save();

      // Create Seller
      const seller = await Seller.create({
        userId: user._id,
        seller_name: sellername.trim(),
        seller_status: "individual",
        seller_company_number: null,
        seller_address: seller_address.trim(),
        seller_country: country,
        seller_email: email || user.email,
        seller_phone: mobile,
        seller_profile_url: profileUrl,
        varificationStatus: "Pending",
        status: "active",
      });

      // Update User.sellerProfile reference
      user.sellerProfile = seller._id;
      await user.save();

      // ✅ FIX: Delete verified flag from Redis after successful registration
      await markAsRegistered(mobile);

      logger.info("Individual seller registered successfully", {
        userId: user._id,
        sellerId: seller._id,
      });

      res.status(201).json({
        success: true,
        message: "Individual seller registration successful",
        data: {
          userId: user._id,
          sellerId: seller._id,
          companyId: null,
          seller_status: "individual",
          seller_country: country,
          roles: user.role,
        },
        nextRoute: "/login",
      });
    } catch (error) {
      logger.error("Individual seller registration failed", {
        error: error.message,
      });
      return next(
        new AppError(
          `Registration failed: ${error.message || "Unknown error"}`,
          500
        )
      );
    }
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

  // Check seller status
  const seller = await Seller.findOne({ userId: user._id });
  if (!seller) {
    return next(new AppError("Seller profile not found", 404));
  }

  if (seller.status === "suspended") {
    return next(new AppError("Your seller account has been suspended", 403));
  }

  if (seller.status === "inactive") {
    return next(new AppError("Your seller account is inactive", 403));
  }

  logger.info("Seller logged in successfully", {
    userId: user._id,
    sellerId: seller._id,
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

  // Get user data
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
export const updateSellerProfile = asyncHandler(async (req, res, next) => {
  // TODO: Implement seller profile update
  res.status(501).json({
    success: false,
    message: "Feature not implemented yet",
  });
});
