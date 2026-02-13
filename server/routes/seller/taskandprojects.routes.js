import express from "express";
import {
  createTaskandProject,
  getAllTasksAndProjects,
  updateTaskAndProject,
  deleteTaskAndProject,
} from "../../controller/seller/taskandprojects.controller.js";
import { isAuthenticated } from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllTasksAndProjects);
router.post("/create", isAuthenticated, createTaskandProject);
router.put("/:id", isAuthenticated, updateTaskAndProject);
router.delete("/:id", isAuthenticated, deleteTaskAndProject);

export default router;
