// routes/quotations.js
import express from "express";
import {
  patchAction,
  bulkAction,
  listInquiries,
  markInquiryAsViewed,
  createInquiry,
  exportInquiries,
  getInquiryDetialById,
} from "../controller/Inquriy.controller.js";
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js"; // placeholder for your auth

const router = express.Router();

router.get("/", verifyUser, allowRoles("seller"), listInquiries);
router.post("/:productId/create", createInquiry);
router.patch("/:id/action", verifyUser, patchAction);
router.patch("/:id/mark-viewed", verifyUser, markInquiryAsViewed);
router.post("/bulk/action", verifyUser, bulkAction);
router.post("/export", verifyUser, exportInquiries);

// inquiry details
router.get("/details/:id", verifyUser, getInquiryDetialById);

export default router;
