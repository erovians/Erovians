import Chat from "../models/message.model.js";

export const createChat = async (req, res) => {
  const { userId } = req.params;         
  const sellerId = req.user.userId;  
  try {
    let chat = await Chat.findOne({
      "members.userId": userId,
      "members.sellerId": sellerId,
    });


    if (!chat) {
      chat = await Chat.create({
        members: { userId, sellerId },
        messages: [],
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const userChats = async (req, res) => {
//   try {
//     const  userId  = req.user.userId;

//     const chats = await Chat.find({
//       $or: [{ userId }, { sellerId: userId }],
//     })
//       .populate("userId", "name email role")
//       .populate("sellerId", "name email role");

//     res.status(200).json(chats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const userChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find chats where the user is either a buyer or a seller
    const chats = await Chat.find({
      $or: [
        { "members.userId": userId },
        { "members.sellerId": userId },
      ],
    })
      // .populate("members.userId", "name email")
      .populate("members.sellerId", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json({ userId, chats });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: error.message });
  }
};


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
