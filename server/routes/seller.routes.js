import express from "express";
import {
  registerSeller,
  sendOtp,
  verifyOtp,
  loginSeller,
  checkUniqueSeller,
  logoutSeller,
  updateSellerProfile,
  loadSeller,
} from "../controller/seller.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
  refreshToken,
} from "../middleware/buyer/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/check-unique", checkUniqueSeller);
router.post(
  "/register",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "seller_profile", maxCount: 1 },
  ]),
  registerSeller
);
router.post("/login", loginSeller);

router.get("/refresh-token", refreshToken);

// ========== PROTECTED ROUTES (Seller Only) ==========
router.get("/me", isAuthenticated, authorizeRoles("seller"), loadSeller);
router.post("/logout", isAuthenticated, authorizeRoles("seller"), logoutSeller);
router.put(
  "/profileupdate",
  isAuthenticated,
  authorizeRoles("seller"),
  upload.fields([{ name: "seller_profile", maxCount: 1 }]),
  updateSellerProfile
);

export default router;
