import express from "express";
import {
  adminLogin,
  verifyAdminOTP,
  loadAdmin,
  resendAdminOTP,
  adminLogout,
} from "../../controller/admin/auth.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/verify-otp", verifyAdminOTP);
router.post("/resend-otp", resendAdminOTP);
router.get(
  "/me",
  isAuthenticated,
  authorizeRoles("admin", "sub_admin", "super_admin"),
  loadAdmin
);
router.post("/logout", isAuthenticated, adminLogout);
export default router;
