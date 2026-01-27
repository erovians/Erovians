import express from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { validateUser } from "../controller/auth.controller.js";
import { isAuthenticated } from "../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.get("/validate", isAuthenticated, validateUser);

export default router;
