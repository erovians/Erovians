import express from "express";

import {
  registerSeller,
  loginSeller,
  checkUniqueSeller,
} from "../controller/sellerRegister.controller.js";
import { sendOtp, verifyOtp } from "../controller/otp.controller.js";
import  {upload}  from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

//route to check the email and gst number alreday exist or not
router.post("/check-unique", checkUniqueSeller);
router.post("/register", upload.single('file'), registerSeller);
router.post("/login", loginSeller);

export default router;
