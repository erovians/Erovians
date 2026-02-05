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
import { isAuthenticated } from "../middleware/buyer/auth.middleware.js";
const router = express.Router();

router.get("/", isAuthenticated, allowRoles("seller"), listInquiries);
router.post("/:productId/create", createInquiry);
router.patch("/:id/action", isAuthenticated, patchAction);
router.patch("/:id/mark-viewed", isAuthenticated, markInquiryAsViewed);
router.post("/bulk/action", isAuthenticated, bulkAction);
router.post("/export", isAuthenticated, exportInquiries);

// inquiry details
router.get("/details/:id", isAuthenticated, getInquiryDetialById);

export default router;
