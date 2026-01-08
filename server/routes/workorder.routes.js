import express from "express";
import {
  createWorkOrder,
  getWorkOrders,
  updateWorkOrderStatus,
  deleteWorkOrder,
} from "../controller/workorder.controller.js";
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyUser, allowRoles("seller"), getWorkOrders);
router.post("/add", verifyUser, allowRoles("seller"), createWorkOrder);
router.put("/:id", verifyUser, allowRoles("seller"), updateWorkOrderStatus);
router.delete("/:id", verifyUser, allowRoles("seller"), deleteWorkOrder);

export default router;
