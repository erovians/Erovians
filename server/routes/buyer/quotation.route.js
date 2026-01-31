import express from "express";
const router = express.Router();
import { upload } from "../../middleware/multer.middleware.js";
import createQuotationRequest from "../../controller/buyer/quotation.controller.js";

// No isAuthenticated middleware - handles both logged in and guest users
router.post(
  "/create",
  upload.array("files", 5), // Max 5 files
  createQuotationRequest
);

export default router;
