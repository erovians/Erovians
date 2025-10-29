import express from "express";
import { createQuotation } from "../controller/quotation.controller.js";

const router = express.Router();

router.post("/create/:productId", createQuotation);

export default router;
