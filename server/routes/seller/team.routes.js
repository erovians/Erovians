import express from "express";
import {
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../../controller/seller/team.controller.js";
import { upload } from "../../middleware/multer.middleware.js";
import { isAuthenticated } from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.post(
  "/addteammember",
  isAuthenticated,
  upload.single("photo"),
  addTeamMember
);
router.get("/getteammember", isAuthenticated, getTeamMembers);
router.put(
  "/update/:id",
  isAuthenticated,
  upload.single("photo"),
  updateTeamMember
);
router.delete("/delete/:id", isAuthenticated, deleteTeamMember);

export default router;
