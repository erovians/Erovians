import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";

// ⚠️ buyer wala sendToken use kar rahe hain
import sendToken from "../../utils/buyer/sendToken.js";

export const adminLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password required",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔐 ADMIN ROLE CHECK (MOST IMPORTANT)
    if (!["admin", "super-admin", "sub-admin"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }

    // ✅ buyer ka sendToken hi use hoga
    sendToken(user, 200, res, "Admin login successful");

  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
