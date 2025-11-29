import express from "express";
import { createTaskandProject, getAllTasksAndProjects ,updateTaskAndProject,deleteTaskAndProject } from "../controller/taskandprojects.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// add task and project routes
router.get("/",getAllTasksAndProjects);
router.post("/create",createTaskandProject);
router.put("/:id",updateTaskAndProject);
router.delete("/:id",deleteTaskAndProject);



export default router;