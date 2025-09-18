import Seller from "../models/sellerSingnup.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.utils.js";

dotenv.config();

export const checkUniqueSeller = async (req, res) => {
  try {
    const { email, gstin } = req.body;
    const query = [];

    if (email) query.push({ email });
    if (gstin) query.push({ gstin });

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
      if (gstin && existing.gstin === gstin) {
        return res.status(409).json({
          success: false,
          field: "gstin",
          message: "GSTIN already exists",
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
    const { email, mobile, gstin, password, businessName, category } = req.body;

    global.verifiedMobiles = global.verifiedMobiles || {};
    if (!global.verifiedMobiles[mobile]) {
      return res.status(400).json({
        message: "Mobile number must be verified before registration.",
      });
    }

    // ===== Field Validations =====
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res
        .status(400)
        .json({ message: "Mobile number must be 10 digits" });
    }

    if (!gstin) {
      return res.status(400).json({ message: "GSTIN is required" });
    }
    const gstinRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(gstin)) {
      return res.status(400).json({
        message: "GSTIN must be 15 characters alphanumeric (A-Z, 0-9)",
      });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (!businessName) {
      return res.status(400).json({ message: "Business Name is required" });
    }
    if (businessName.length < 3) {
      return res
        .status(400)
        .json({ message: "Business Name must be at least 3 characters long" });
    }

    // ===== Check existing seller =====
    const existingSeller = await Seller.findOne({
      $or: [{ email }, { mobile }, { gstin }],
    });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already registered" });
    }

    // ===== Password Hash =====
    const hashedPassword = await bcrypt.hash(password, 12);

    // Image check
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      return res.status(400).json({
        success: false,
        error: "File is required",
      });
    }

    // Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      return res.status(400).json({
        success: false,
        error: "Failed to upload file",
      });
    }

    // ===== Create Seller =====
    const seller = new Seller({
      email,
      mobile,
      gstin,
      password: hashedPassword,
      businessName,
      category,
      businessDocument: avatar.url,
      isMobileVerified: true,
    });

    const savedSeller = await seller.save();

    // cleanup verified mobile
    delete global.verifiedMobiles[mobile];

    // ===== Generate JWT =====
    const token = jwt.sign(
      { id: savedSeller._id, email: savedSeller.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Seller registered successfully",
      seller: {
        id: savedSeller._id,
        email: savedSeller.email,
        mobile: savedSeller.mobile,
        businessName: savedSeller.businessName,
        category: savedSeller.category,
        businessDocument: savedSeller.businessDocument,
        isMobileVerified: savedSeller.isMobileVerified,
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

    // Find seller by email or mobile
    const seller = await Seller.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Make sure secret exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env file");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response (without token in body, cookie is stored automatically)
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
