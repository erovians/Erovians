import express from "express";
import {
  createChat,
  getMyChatUsers,
  sendMessage,
  getMessages,
} from "../controller/chat.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// router.post("/send-message", verifyUser,sendMessage);
router.post("/send-message", verifyUser, sendMessage);
router.get("/my-chats", verifyUser, getMyChatUsers);
router.post("/:userId", verifyUser, createChat);
router.get("/:chatId/messages", verifyUser, getMessages);

export default router;
