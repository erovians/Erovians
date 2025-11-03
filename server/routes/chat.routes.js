import express from "express";
import {
  createChat,
  userChats,
  sendMessage,
  getMessages,
} from "../controller/chat.controller.js";

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChats);
router.post("/message", sendMessage);
router.get("/messages/:chatId", getMessages);

export default router;
