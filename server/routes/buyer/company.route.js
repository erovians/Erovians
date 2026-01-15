import express from "express";
const router = express.Router();
import { fetchCompany } from "../../controller/buyer/company.controller.js";

router.get("/fetch-company", fetchCompany);

export default router;
