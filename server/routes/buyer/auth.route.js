import express from "express";
import {
  checkUserAndSendOTP,
  completeRegistration,
  getMe,
  loginWithPassword,
  logoutUser,
  resendOTP,
  updateAddress,
  updateBasicProfile,
  verifyOTP,
} from "../../controller/buyer/auth.controller.js";
const router = express.Router();
import {
  isAuthenticated,
  refreshToken,
} from "../../middleware/buyer/auth.middleware.js";

router.post("/check-user", checkUserAndSendOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/complete-registration", completeRegistration);
router.post("/login-password", loginWithPassword); // ✅ NEW ROUTE

router.put("/update-user", isAuthenticated, updateBasicProfile);
router.put("/update-address", isAuthenticated, updateAddress);

router.get("/refresh-token", refreshToken);
router.get("/me", isAuthenticated, getMe);
router.post("/logout", isAuthenticated, logoutUser);

export default router;
