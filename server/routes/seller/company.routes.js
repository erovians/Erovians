import express from "express";
import {
  saveCompany, // ✅ NEW - Single action
  getCompanyDetails,
} from "../../controller/seller/company.controller.js";
import { upload } from "../../middleware/multer.middleware.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

// ✅ 1. GET Company Details
router.get(
  "/details",
  isAuthenticated,
  authorizeRoles("seller"),
  getCompanyDetails
);

// ✅ 2. SAVE Company (CREATE + UPDATE both)
router.post(
  "/save",
  isAuthenticated,
  authorizeRoles("seller"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "companyPhotos", maxCount: 10 },
    { name: "companyVideo", maxCount: 1 },
    { name: "registration_documents", maxCount: 5 },
  ]),
  saveCompany
);

export default router;
