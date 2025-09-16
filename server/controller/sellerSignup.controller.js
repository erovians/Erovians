import Seller from "../models/sellerSingnup.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerSeller = async (req, res) => {
  try {
    const { email, mobile, gstin, password, businessName, category } = req.body;

    global.verifiedMobiles = global.verifiedMobiles || {};
    if (!global.verifiedMobiles[mobile]) {
      return res.status(400).json({
        message: "Mobile number must be verified before registration.",
      });
    }

    // every field check
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!mobile)
      return res.status(400).json({ message: "Mobile number is required" });
    if (!gstin) return res.status(400).json({ message: "GSTIN is required" });
    if (!password)
      return res.status(400).json({ message: "Password is required" });
    if (!businessName)
      return res.status(400).json({ message: "Business Name is required" });

    // seller exist or not
    const existingSeller = await Seller.findOne({
      $or: [{ email }, { mobile }, { gstin }],
    });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already registered" });
    }

    // password encrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // create seller
    const seller = new Seller({
      email,
      mobile,
      gstin,
      password: hashedPassword,
      businessName,
      category,
      isMobileVerified: true,
    });

    const savedSeller = await seller.save();

    delete global.verifiedMobiles[mobile];

    // generate JWT
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
        isMobileVerified: savedSeller.isMobileVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering seller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
