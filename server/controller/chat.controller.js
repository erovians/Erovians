import Chat from "../models/chat.model.js";

// ✅ Create or get chat between two users
export const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    let chat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [senderId, receiverId],
        messages: [],
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all chats for a user
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

// ✅ Send message (push to messages array)
export const sendMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ senderId, text });
    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all messages of a chat
export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate(
      "messages.senderId",
      "name role"
    );

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
