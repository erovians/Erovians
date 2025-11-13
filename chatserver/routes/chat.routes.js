import express from "express";
import {
  createChat,
  userChats,
  sendMessage,
  getMessages,
} from "../controller/chat.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:userId", verifyUser, createChat);
router.get("/",verifyUser, userChats);
router.post("/message", sendMessage);
router.get("/messages/:chatId", getMessages);

export default router;
