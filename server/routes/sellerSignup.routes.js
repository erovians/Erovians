import express from "express";
import { registerSeller } from "../controller/sellerSignup.controller.js";
import { loginSeller } from "../controller/sellerLogin.controller.js";

const router = express.Router();

router.post("/register", registerSeller);
router.post("/login", loginSeller);

export default router;
