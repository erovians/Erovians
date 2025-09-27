import Seller from "../models/sellerSingnup.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
dotenv.config();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

const isValidGSTIN = (businessId) =>
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(businessId);

const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(password);

export const checkUniqueSeller = async (req, res) => {
  try {
    const { email, businessId } = req.body;
    const query = [];

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Invalid email format.",
      });
    }
    if (businessId && !isValidGSTIN(businessId)) {
      return res.status(400).json({
        success: false,
        field: "businessId",
        message: "Invalid businessId format.",
      });
    }

    if (email) query.push({ email });
    if (businessId) query.push({ businessId });

    if (query.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    const existing = await Seller.findOne({ $or: query });

    if (existing) {
      if (email && existing.email === email) {
        return res.status(409).json({
          success: false,
          field: "email",
          message: "Email already exists",
        });
      }
      if (businessId && existing.businessId === businessId) {
        return res.status(409).json({
          success: false,
          field: "businessId",
          message: "businessId already exists",
        });
      }
    }

    return res.status(200).json({ success: true, message: "Available" });
  } catch (err) {
    console.error("Error checking unique:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const registerSeller = async (req, res) => {
  try {
    const {
      email,
      mobile,
      businessId,
      password,
      sellername,
      companyregstartionlocation,
      businessName,
    } = req.body;

    // Validations
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!mobile || !isValidMobile(mobile)) {
      return res
        .status(400)
        .json({ message: "Valid mobile number is required" });
    }
    if (!businessId || !isValidGSTIN(businessId)) {
      return res.status(400).json({ message: "Valid businessId is required" });
    }
    if (!password || !isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with letters and numbers",
      });
    }
    if (!businessName || businessName.trim().length < 2) {
      return res.status(400).json({ message: "Business name is required" });
    }
    if (!sellername || sellername.trim().length < 2) {
      return res.status(400).json({ message: "Seller name is required" });
    }
    if (
      !companyregstartionlocation ||
      companyregstartionlocation.trim().length < 2
    ) {
      return res
        .status(400)
        .json({ message: "Company registration location is required" });
    }

    global.verifiedMobiles = global.verifiedMobiles || {};
    if (!global.verifiedMobiles[mobile]) {
      return res.status(400).json({
        message: "Mobile number must be verified before registration.",
      });
    }

    // File validation
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "GSTIN document is required." });
    }
    const file = req.files.file;
    const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!acceptedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only JPG, PNG, and PDF are allowed.",
      });
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({ message: "File size exceeds 5MB." });
    }

    // Check existing seller
    const existingSeller = await Seller.findOne({
      $or: [{ email }, { mobile }, { businessId }],
    });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Upload GSTIN document
    const uploadResult = await uploadOnCloudinary(file.tempFilePath);
    const documentUrl = uploadResult?.secure_url;
    if (!documentUrl) {
      return res
        .status(500)
        .json({ message: "Failed to upload document to Cloudinary." });
    }

    // Create seller
    const seller = new Seller({
      email,
      mobile,
      businessId,
      password: hashedPassword,
      sellername,
      companyregstartionlocation,
      businessName,
      documentUrl,
      isMobileVerified: true,
    });

    const savedSeller = await seller.save();
    delete global.verifiedMobiles[mobile];

    // JWT token
    const token = jwt.sign(
      { id: savedSeller._id, email: savedSeller.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Response
    res.status(201).json({
      message: "Seller registered successfully",
      seller: {
        id: savedSeller._id,
        email: savedSeller.email,
        mobile: savedSeller.mobile,
        sellername: savedSeller.sellername,
        companyregstartionlocation: savedSeller.companyregstartionlocation,
        businessName: savedSeller.businessName,
        businessId: savedSeller.businessId,
        isMobileVerified: savedSeller.isMobileVerified,
        documentUrl: savedSeller.documentUrl,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering seller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginSeller = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Email or Mobile is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const seller = await Seller.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env file");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      seller: {
        id: seller._id,
        email: seller.email,
        mobile: seller.mobile,
        businessName: seller.businessName,
        category: seller.category,
        isMobileVerified: seller.isMobileVerified,
      },
    });
  } catch (error) {
    console.error("Error logging in seller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
