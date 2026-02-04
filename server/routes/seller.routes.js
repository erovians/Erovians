import express from "express";

import {
  registerSeller,
  sendOtp,
  verifyOtp,
  loginSeller,
  checkUniqueSeller,
  refreshTokenController,
  logoutSeller,
} from "../controller/seller.controller.js";

import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/refresh", refreshTokenController); // Route to refresh JWT tokens

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/check-unique", checkUniqueSeller);
router.post("/register", upload.single("file"), registerSeller);
router.post("/login", loginSeller);
router.post("/logout", logoutSeller);

export default router;
