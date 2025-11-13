import Seller from "../models/sellerSingnup.model.js";

export const validateUser = async (req, res) => {
  try {
    const userId = req?.user?.userId;

    if (!userId) {
      return res.status(400).json({ valid: false, message: "Invalid user ID" });
    }

    const user = await Seller.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      valid: true,
      user,
    });
  } catch (error) {
    console.error("validateUser error:", error);

    return res.status(500).json({
      valid: false,
      message: "Internal server error",
    });
  }
};
