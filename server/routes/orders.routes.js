// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrderById,
  getSellerOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controller/order.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyUser, createOrder);
router.get("/:id", verifyUser, getOrderById);
router.get("/userorders", verifyUser, getUserOrders);
router.get("/sellerorders", verifyUser, getSellerOrders);
router.patch("/:id/status", verifyUser, updateOrderStatus);
export default router;
