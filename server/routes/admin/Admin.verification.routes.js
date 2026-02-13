import express from "express";
import {
  getPendingRequests,
  approveIndividualSeller,
  rejectIndividualSeller,
  suspendSeller,
  approveCompany,
  rejectCompany,
} from "../../controller/admin/Admin.verification.controller.js";

const router = express.Router();

router.get("/requests/pending", getPendingRequests);

router.patch("/seller/:id/approve", approveIndividualSeller);
router.patch("/seller/:id/reject", rejectIndividualSeller);
router.patch("/seller/:id/suspend", suspendSeller);

router.patch("/company/:id/approve", approveCompany);
router.patch("/company/:id/reject", rejectCompany);

export default router;
