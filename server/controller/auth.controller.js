// import Seller from "../models/sellerSingnup.model.js";

// export const validateUser = async (req, res) => {
//   try {
//     const userId = req?.user?.userId;

//     if (!userId) {
//       return res.status(400).json({ valid: false, message: "Invalid user ID" });
//     }

//     const user = await Seller.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json({
//       valid: true,
//       user,
//     });
//   } catch (error) {
//     console.error("validateUser error:", error);

//     return res.status(500).json({
//       valid: false,
//       message: "Internal server error",
//     });
//   }
// };
import User from "../models/user.model.js";
import Seller from "../models/sellerSingnup.model.js";

export const validateUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        valid: false,
        message: "Not authenticated",
      });
    }

    // ✅ Fetch AUTH user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        valid: false,
        message: "User not found",
      });
    }

    // ✅ If seller role exists, fetch seller profile
    let seller = null;
    if (user.role.includes("seller")) {
      seller = await Seller.findOne({ userId: user._id });
    }

    return res.status(200).json({
      valid: true,
      user,
      seller,
      roles: user.role,
    });
  } catch (error) {
    console.error("validateUser error:", error);
    return res.status(500).json({
      valid: false,
      message: "Internal server error",
    });
  }
};
