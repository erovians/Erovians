import taskandprojectModel from "../models/taskandproject.model.js";
import { cache } from "../services/cache.service.js";

export const createTaskandProject = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID not found.",
      });
    }

    const { title, description, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const validStatuses = ["To Do", "Doing", "Review", "Done"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const existing = await taskandprojectModel.findOne({
      title: title.trim(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A task/project with the same title already exists.",
      });
    }

    const newTask = await taskandprojectModel.create({
      createdBy: userId,
      title: title.trim(),
      description: description || "",
      status: status || "To Do",
    });

    await cache.del(`tasks:user:${userId}`);

    return res.status(201).json({
      success: true,
      message: "Task/Project created successfully",
      data: newTask,
    });
  } catch (err) {
    console.error("Error creating task/project:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllTasksAndProjects = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID not found.",
      });
    }

    const cacheKey = `tasks:user:${userId}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      console.log("🔥 Redis HIT getAllTasksAndProjects:", cacheKey);
      return res.status(200).json({
        success: true,
        message: "Tasks and Projects fetched successfully",
        data: cached,
        fromCache: true,
      });
    }

    const tasks = await taskandprojectModel
      .find({ createdBy: userId })
      .sort({ createdAt: -1 });

    await cache.set(cacheKey, tasks, 300); // 5 min

    return res.status(200).json({
      success: true,
      message: "Tasks and Projects fetched successfully",
      data: tasks,
      fromCache: false,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateTaskAndProject = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    const { title, description, status } = req.body;

    if (title && title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty.",
      });
    }

    const validStatuses = ["To Do", "Doing", "Review", "Done"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
      });
    }

    const task = await taskandprojectModel.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized.",
      });
    }

    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (status) task.status = status;

    await task.save();

    await cache.del(`tasks:user:${userId}`);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const deleteTaskAndProject = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const deleted = await taskandprojectModel.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized.",
      });
    }

    await cache.del(`tasks:user:${userId}`);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
