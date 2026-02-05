import express from "express";
import {
  registerCompany,
  getCompanyDetails,
} from "../controller/company.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { allowRoles, verifyUser } from "../middleware/auth.middleware.js";
import {
  uploadCertificate,
  getCertificates,
  deleteCertificate,
} from "../controller/certificate.controller.js";
import { isAuthenticated } from "../middleware/buyer/auth.middleware.js";
import { validateUser } from "../controller/auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  isAuthenticated,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "companyPhotos", maxCount: 10 },
    { name: "companyVideo", maxCount: 1 },
  ]),
  registerCompany
);
router.get("/details", isAuthenticated, getCompanyDetails);

router.post(
  "/upload",
  isAuthenticated,
  allowRoles("seller"),
  upload.single("file"),
  uploadCertificate
);
router.get("/certificates", isAuthenticated, getCertificates);
router.delete("/certificates/:id", isAuthenticated, deleteCertificate);

export default router;
