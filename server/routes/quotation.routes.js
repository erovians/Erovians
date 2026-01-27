import express from "express";
import {
  createQuotation,
  getQuotationsBySeller,
  getSellerQuotationById,
} from "../controller/quotation.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { isAuthenticated } from "../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.post("/create/:productId", isAuthenticated, createQuotation);
router.get("/sellerquote", isAuthenticated, getQuotationsBySeller);
router.get("/sellerquote/:id", isAuthenticated, getSellerQuotationById);

export default router;
