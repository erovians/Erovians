// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrderById,
  getSellerOrders,
  getUserOrders,
  updateOrderStatus,
  getCompletedOrders,
  getPendingOrders,
  exportOrders,
} from "../../controller/seller/order.controller.js";
import { isAuthenticated } from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, createOrder);
router.get("/:id", isAuthenticated, getOrderById);
router.get("/userorders", isAuthenticated, getUserOrders);
router.get("/sellerorders/all/orders", isAuthenticated, getSellerOrders);
router.patch("/:id/status", isAuthenticated, updateOrderStatus);
router.get("/status/completed", isAuthenticated, getCompletedOrders);
router.get("/status/pending", isAuthenticated, getPendingOrders);
router.get("/ordersheet/download", isAuthenticated, exportOrders);
export default router;
