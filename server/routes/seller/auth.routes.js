import express from "express";
import { validateUser } from "../../controller/seller/auth.controller.js";
import { isAuthenticated } from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.get("/validate", isAuthenticated, validateUser);

export default router;
