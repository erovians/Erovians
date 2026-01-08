import express from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { validateUser } from "../controller/auth.controller.js";

const router = express.Router();

router.get("/validate", verifyUser, validateUser);

export default router;
