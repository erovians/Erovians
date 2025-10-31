import express from "express";
import {
  createQuotation,
  getQuotationsBySeller,
} from "../controller/quotation.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create/:productId", verifyUser, createQuotation);
router.get("/sellerquote", verifyUser, getQuotationsBySeller);

export default router;
