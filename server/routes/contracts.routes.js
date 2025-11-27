// routes/contractRoutes.js
import express from "express";
import {
  addContract,
  getContracts,
  updateContractStatus,
  downloadContractPDF,
} from "../controller/contracts.controller.js";
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyUser, allowRoles("seller"), addContract);
router.get("/", verifyUser, allowRoles("seller"), getContracts);
router.put(
  "/update/:id",
  verifyUser,
  allowRoles("seller"),
  updateContractStatus
);
router.get(
  "/download/:id",
  verifyUser,
  allowRoles("seller"),
  downloadContractPDF
);

export default router;
