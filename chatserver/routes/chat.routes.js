import express from "express";
import {
  createChat,
  getMyChatUsers,
  sendMessage,
  getMessages,
} from "../controller/chat.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/send-message", verifyUser, upload.single("file"), sendMessage);
router.get("/my-chats", verifyUser, getMyChatUsers);
router.post("/:userId", verifyUser, createChat);
router.get("/:chatId/messages", verifyUser, getMessages);

export default router;
