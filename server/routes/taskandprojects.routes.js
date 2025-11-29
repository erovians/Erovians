import express from "express";
import { createTaskandProject, getAllTasksAndProjects ,updateTaskAndProject,deleteTaskAndProject } from "../controller/taskandprojects.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",verifyUser,getAllTasksAndProjects);
router.post("/create",verifyUser,createTaskandProject);
router.put("/:id",verifyUser,updateTaskAndProject);
router.delete("/:id",verifyUser,deleteTaskAndProject);


export default router;