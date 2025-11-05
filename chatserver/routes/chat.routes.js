import express from "express";
import {
  createChat,
  getMyChatUsers,
  sendMessage,
} from "../controller/chat.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-message", verifyUser,sendMessage);
router.get("/my-chats",verifyUser, getMyChatUsers);
router.post("/:userId", verifyUser, createChat);
// router.get("/messages/:chatId", getMessages);

export default router;
