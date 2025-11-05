import express from "express";
import {
  createChat,
  getMyChatUsers,
} from "../controller/chat.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:userId", verifyUser, createChat);
router.get("/my-chats",verifyUser, getMyChatUsers);
// router.post("/message", sendMessage);
// router.get("/messages/:chatId", getMessages);

export default router;
