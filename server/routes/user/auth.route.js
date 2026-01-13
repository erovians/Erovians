import express from "express";
import {
  checkUserAndSendOTP,
  completeRegistration,
  getMe,
  resendOTP,
  verifyOTP,
} from "../../controller/user/auth.controller.js";
const router = express.Router();
import {
  isAuthenticated,
  refreshToken,
} from "../../middleware/users/auth.middleware.js";

router.post("/check-user", checkUserAndSendOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/complete-registration", completeRegistration);

router.get("/refresh-token", refreshToken);
router.get("/me", isAuthenticated, getMe);
export default router;
