import express from "express";
import {
  createWorkOrder,
  getWorkOrders,
  updateWorkOrderStatus,
} from "../../controller/seller/workorder.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, authorizeRoles("seller"), getWorkOrders);
router.post("/add", isAuthenticated, authorizeRoles("seller"), createWorkOrder);
router.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("seller"),
  updateWorkOrderStatus
);

export default router;
