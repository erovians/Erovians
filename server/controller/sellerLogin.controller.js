import Seller from "../models/sellerSingnup.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    // Generate JWT
    const token = jwt.sign(
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
      token,
    });
  } catch (error) {
    console.error("Error logging in seller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
