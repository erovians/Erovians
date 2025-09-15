import express from "express";
import { registerSeller } from "../controller/sellerSignup.controller.js";

const router = express.Router();

router.post("/register", registerSeller);

export default router;
