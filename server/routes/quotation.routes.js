import express from "express";
import {
  createQuotation,
  getQuotationsBySeller,
  getSellerQuotationById,
} from "../controller/quotation.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create/:productId", verifyUser, createQuotation);
router.get("/sellerquote", verifyUser, getQuotationsBySeller);
router.get("/sellerquote/:id", verifyUser, getSellerQuotationById);

export default router;
