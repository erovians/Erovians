// routes/contractRoutes.js
import express from "express";
import {
  addContract,
  getContracts,
} from "../controller/contracts.controller.js";

const router = express.Router();

router.post("/add", addContract);
router.get("/", getContracts);

export default router;
