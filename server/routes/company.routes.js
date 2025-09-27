import express from "express";
import {
  createCompanyBasicInfo,
  createCompanyIntro,
} from "../controller/company.controller.js";

const router = express.Router();

router.post("/basic-info", createCompanyBasicInfo);
router.post("/intro", createCompanyIntro);

export default router;
