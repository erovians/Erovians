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

// router.get("/",verifyUser, allowRoles, getWorkOrders);
// router.post("/add",verifyUser, allowRoles, createWorkOrder);
// router.put("/:id",verifyUser, allowRoles, updateWorkOrderStatus);

export default router;
