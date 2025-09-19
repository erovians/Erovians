import express from "express";
import { createCompany } from "../controller/company.controller.js";

const router = express.Router();

router.post("/register", createCompany);

export default router;
