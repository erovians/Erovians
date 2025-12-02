import express from "express";
import {
  createWorkOrder,
  getWorkOrders,
  updateWorkOrderStatus,
} from "../controller/workorder.controller.js";
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getWorkOrders);
router.post("/add", createWorkOrder);
router.put("/:id", updateWorkOrderStatus);

export default router;
