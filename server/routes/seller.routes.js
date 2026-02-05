import express from "express";

import {
  registerSeller,
  sendOtp,
  verifyOtp,
  loginSeller,
  checkUniqueSeller,
  refreshTokenController,
  logoutSeller,
  getSellerProfile,
  updateSellerProfile,
} from "../controller/seller.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/refresh", refreshTokenController); // Route to refresh JWT tokens

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/check-unique", checkUniqueSeller);
// router.post("/register", upload.single("file"), registerSeller);
router.post(
  "/register",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "seller_profile", maxCount: 1 },
  ]),
  registerSeller
);
router.post("/login", loginSeller);
router.post("/logout", logoutSeller);

// seller profile
router.get("/profile", verifyUser, allowRoles("seller"), getSellerProfile);

router.put(
  "/profileupdate",
  verifyUser,
  allowRoles("seller"),
  upload.fields([{ name: "seller_profile", maxCount: 1 }]),
  updateSellerProfile
);

export default router;
