import express from "express";
import { adminLogin } from "../../controller/admin/auth.controller.js";

const router = express.Router();

router.post("/login", adminLogin);

export default router;
