import express from "express";
import {
  registerCompany,
  updateCompany,
  getCompanyDetails,
} from "../controller/company.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  uploadCertificate,
  getCertificates,
  deleteCertificate,
} from "../controller/certificate.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/buyer/auth.middleware.js";

const router = express.Router();

// Company routes
router.post(
  "/register",
  isAuthenticated,
  authorizeRoles("seller"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "companyPhotos", maxCount: 10 },
    { name: "companyVideo", maxCount: 1 },
    { name: "registration_documents", maxCount: 5 }, // ✅ NEW
  ]),
  registerCompany
);

router.patch(
  "/update",
  isAuthenticated,
  authorizeRoles("seller"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "companyPhotos", maxCount: 10 },
    { name: "companyVideo", maxCount: 1 },
    { name: "registration_documents", maxCount: 5 }, // ✅ NEW
  ]),
  updateCompany
);

router.get("/details", isAuthenticated, getCompanyDetails);

// Certificate routes
router.post(
  "/upload",
  isAuthenticated,
  authorizeRoles("seller"),
  upload.single("file"),
  uploadCertificate
);
router.get("/certificates", isAuthenticated, getCertificates);
router.delete("/certificates/:id", isAuthenticated, deleteCertificate);

export default router;
