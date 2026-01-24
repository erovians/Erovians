import User from "../models/user.model.js";
import Seller from "../models/sellerSingnup.model.js";
import asyncHandler from "../middleware/buyer/asyncHandler.js";
import AppError from "../utils/buyer/AppError.js";
import sendToken from "../utils/buyer/sendToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import logger from "../config/winston.js";

// ======================== VALIDATORS ========================
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);
const isValidGSTIN = (businessId) =>
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(businessId);

// ======================== CHECK UNIQUE SELLER ========================
export const checkUniqueSeller = asyncHandler(async (req, res, next) => {
  const { email, mobile, businessId } = req.body;

  // Validation
  if (email && !isValidEmail(email)) {
    return next(new AppError("Invalid email format", 400));
  }
  if (mobile && !isValidMobile(mobile)) {
    return next(new AppError("Invalid mobile format", 400));
  }
  if (businessId && !isValidGSTIN(businessId)) {
    return next(new AppError("Invalid GSTIN format", 400));
  }

  // ✅ Check email in User collection
  if (email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail.mobile !== mobile) {
      // Email exists but different mobile - conflict
      return next(new AppError("Email already exists", 409));
    }
  }

  // ✅ Check businessId in Seller collection
  if (businessId) {
    const existingSeller = await Seller.findOne({ businessId });
    if (existingSeller) {
      return next(new AppError("GSTIN already registered", 409));
    }
  }

  logger.info("Seller uniqueness check passed", { email, mobile, businessId });

  res.status(200).json({
    success: true,
    message: "Available",
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
  } = req.body;

  // ========== VALIDATIONS ==========
  if (!email || !isValidEmail(email)) {
    return next(new AppError("Valid email is required", 400));
  }
  if (!mobile || !isValidMobile(mobile)) {
    return next(new AppError("Valid mobile number is required", 400));
  }
  if (!businessId || !isValidGSTIN(businessId)) {
    return next(new AppError("Valid GSTIN is required", 400));
  }
  if (!password || password.length < 6) {
    return next(
      new AppError("Password must be at least 6 characters long", 400)
    );
  }
  if (!sellername || sellername.trim().length < 2) {
    return next(new AppError("Seller name is required", 400));
  }

  // ✅ Validate sellername format (only letters and spaces)
  if (!/^[a-zA-Z\s]+$/.test(sellername)) {
    return next(
      new AppError("Seller name can only contain letters and spaces", 400)
    );
  }

  if (!businessName || businessName.trim().length < 2) {
    return next(new AppError("Business name is required", 400));
  }
  if (
    !companyregstartionlocation ||
    companyregstartionlocation.trim().length < 2
  ) {
    return next(new AppError("Company registration location is required", 400));
  }
  if (
    !seller_status ||
    !["professional", "Individual"].includes(seller_status)
  ) {
    return next(new AppError("Valid seller status is required", 400));
  }
  if (!seller_address || seller_address.trim().length < 5) {
    return next(new AppError("Seller address is required", 400));
  }

  // ========== FILE VALIDATION ==========
  const file = req.file;
  if (!file) {
    return next(new AppError("GSTIN document is required", 400));
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
    if (existingEmail) {
      return next(new AppError("Email already exists", 409));
    }
  }

  // ========== CHECK GSTIN UNIQUE ==========
  const existingSeller = await Seller.findOne({ businessId });
  if (existingSeller) {
    return next(new AppError("GSTIN already registered", 409));
  }

  // ========== UPLOAD DOCUMENT ==========
  const uploadResult = await uploadOnCloudinary(file.path);
  const documentUrl = uploadResult?.secure_url;
  if (!documentUrl) {
    return next(new AppError("Failed to upload document", 500));
  }

  // ========== UPDATE USER WITH COMPLETE DETAILS ==========
  user.email = email;
  user.password = password; // Will be hashed by pre-save hook
  user.name = sellername; // ✅ Map sellername to name
  user.role = ["user", "seller"]; // ✅ Add seller role
  await user.save();

  logger.info("User updated with seller role", { userId: user._id });

  // ========== CREATE SELLER DOCUMENT ==========
  const seller = await Seller.create({
    userId: user._id, // ✅ Reference to User
    businessId,
    businessName,
    companyregstartionlocation,
    seller_status,
    seller_address,
    documentUrl,
    varificationStatus: "Pending",
    status: "active",
  });

  logger.info("Seller created successfully", {
    userId: user._id,
    sellerId: seller._id,
  });

  // ========== SEND TOKEN ==========
  res.status(201).json({
    success: true,
    message: "Seller Register Successfully",
    nextRoute: "/login",
  });
});

// ======================== LOGIN SELLER ========================
export const loginSeller = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body;

  console.log(req.body);

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
