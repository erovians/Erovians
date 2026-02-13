import User from "../../models/user.model.js";

export const validateUser = async (req, res) => {
  try {
    // req.user me decoded JWT data hai: {id, role}
    const userId = req.user.id; // ✅ req.user.userId nahi, req.user.id

    if (!userId) {
      return res.status(400).json({
        valid: false,
        message: "Invalid user ID",
      });
    }

    // ✅ User model use karo (Seller nahi)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        valid: false,
        message: "User not found",
      });
    }
    console.log(user);

    return res.status(200).json({
      valid: true,
      user: user.toSafeObject(), // ya directly user bhi bhej sakte ho
    });
  } catch (error) {
    console.error("validateUser error:", error);

    return res.status(500).json({
      valid: false,
      message: "Internal server error",
    });
  }
};
