// routes/quotations.js
import express from "express";
import { patchAction, bulkAction, listInquires, createInquiry } from "../controller/Inquriy.controller.js";
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js"; // placeholder for your auth

const router = express.Router();



router.get("/", verifyUser, allowRoles("seller"), listInquires);
router.post("/:productId/create", createInquiry)
router.patch("/:id/action", verifyUser, patchAction);
router.post("/bulk/action", verifyUser, bulkAction);

export default router;

