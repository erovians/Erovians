// routes/contractRoutes.js
import express from "express";
import {
  addContract,
  getContracts,
  updateContractStatus,
  downloadContractPDF,
} from "../controller/contracts.controller.js";

const router = express.Router();

router.post("/add", addContract);
router.get("/", getContracts);
router.put("/update/:id", updateContractStatus);
router.get("/download/:id", downloadContractPDF);

export default router;
