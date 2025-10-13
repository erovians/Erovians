import express from "express";
import {
  registerCompany,
  getCompanyDetails,
} from "../controller/company.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { uploadCertificate } from "../controller/certificate.controller.js";


const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "companyPhotos", maxCount: 10 },
    { name: "companyVideo", maxCount: 1 },
  ]),
  registerCompany
);
router.get("/details", getCompanyDetails);

router.post("/uploadcertificate", upload.single("file"), uploadCertificate);

export default router;
