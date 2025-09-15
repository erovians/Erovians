import express from "express";
import { registerSeller } from "../controller/sellerSignup.controller.js";
import { loginSeller } from "../controller/sellerLogin.controller.js";
import { sendOtp, verifyOtp } from "../controller/otp.controller.js";

const router = express.Router();

router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
