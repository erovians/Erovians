import express from "express";
import {
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../controller/team.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/addteammember",
  verifyUser,
  upload.single("photo"),
  addTeamMember
);
router.get("/getteammember", verifyUser, getTeamMembers);
router.put("/update/:id", verifyUser, upload.single("photo"), updateTeamMember);
router.delete("/delete/:id", verifyUser, deleteTeamMember);

export default router;
