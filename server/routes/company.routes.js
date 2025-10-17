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
} from "../controller/certificate.controller.js";

const router = express.Router();

router.post(
  "/register",
  verifyUser,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "companyPhotos", maxCount: 10 },
    { name: "companyVideo", maxCount: 1 },
  ]),
  registerCompany
);
router.get("/details", verifyUser, getCompanyDetails);

router.post(
  "/upload",
  verifyUser,
  allowRoles("seller"),
  upload.single("file"),
  uploadCertificate
);
router.get("/certificates", verifyUser, getCertificates);

export default router;
