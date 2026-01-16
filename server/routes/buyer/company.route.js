import express from "express";
const router = express.Router();
import {
  fetchCompany,
  fetchCompanyProduct,
  fetchProductDetails,
} from "../../controller/buyer/company.controller.js";

router.get("/fetch-company", fetchCompany);
router.get("/fetch/:companyId/product", fetchCompanyProduct);
router.get("/fetch/:productId/detail", fetchProductDetails);

export default router;
