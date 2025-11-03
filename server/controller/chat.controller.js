import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    let chat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({ members: [senderId, receiverId] });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: { $in: [req.params.userId] },
    }).populate("members", "name email role");

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const message = await Message.create({ chatId, senderId, text });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).populate(
      "senderId",
      "name role"
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
