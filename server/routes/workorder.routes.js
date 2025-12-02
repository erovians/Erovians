import express from "express";
import {
  createWorkOrder,
  getWorkOrders,
  updateWorkOrderStatus,
} from "../controller/workorder.controller.js";
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyUser, allowRoles("seller"), getWorkOrders);
router.post("/add", verifyUser, allowRoles("seller"), createWorkOrder);
router.put("/:id", verifyUser, allowRoles("seller"), updateWorkOrderStatus);

export default router;
