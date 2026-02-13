// routes/contractRoutes.js
import express from "express";
import {
  addContract,
  getContracts,
  updateContractStatus,
  downloadContractPDF,
} from "../../controller/seller/contracts.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.post("/add", isAuthenticated, authorizeRoles("seller"), addContract);
router.get("/", isAuthenticated, authorizeRoles("seller"), getContracts);
router.put(
  "/update/:id",
  isAuthenticated,
  authorizeRoles("seller"),
  updateContractStatus
);
router.get(
  "/download/:id",
  isAuthenticated,
  authorizeRoles("seller"),
  downloadContractPDF
);

export default router;
