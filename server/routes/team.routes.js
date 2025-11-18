import express from "express";
import {
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../controller/team.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addteammember", verifyUser, addTeamMember);
router.get("/getteammember", verifyUser, getTeamMembers);
router.put("/update/:id", verifyUser, updateTeamMember);
router.delete("/delete/:id", verifyUser, deleteTeamMember);

export default router;
