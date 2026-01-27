// routes/contractRoutes.js
import express from "express";
import {
  addContract,
  getContracts,
  updateContractStatus,
  downloadContractPDF,
} from "../controller/contracts.controller.js";
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js";
import { isAuthenticated } from "../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.post("/add", isAuthenticated, allowRoles("seller"), addContract);
router.get("/", isAuthenticated, allowRoles("seller"), getContracts);
router.put(
  "/update/:id",
  isAuthenticated,
  allowRoles("seller"),
  updateContractStatus
);
router.get(
  "/download/:id",
  isAuthenticated,
  allowRoles("seller"),
  downloadContractPDF
);

export default router;
