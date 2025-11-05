import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

// frst user will create chat with seller
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

// second user (seller or user) will get all chat users
export const getMyChatUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

    const chats = await Chat.find({
      $or: [
        { "members.userId": loggedInUserId },
        { "members.sellerId": loggedInUserId }
      ]
    })
      .populate("members.userId", "email mobile role")
      .populate("members.sellerId", "email mobile role")
      .sort({ updatedAt: -1 });

    const chatUsers = chats
      .map((chat) => {
        const { userId, sellerId } = chat.members;

        
        if (!userId && !sellerId) return null;

        let otherUser;

        
        if (userId && userId._id?.toString() === loggedInUserId.toString()) {
          otherUser = sellerId;
        } else {
          otherUser = userId;
        }

        // If otherUser is null (for safety), skip this chat
        if (!otherUser) return null;

        return {
          chatId: chat._id.toString(),
          user: otherUser,
          lastMessage: chat.lastMessage || null,
          lastMessageAt: chat.lastMessageAt || chat.updatedAt,
        };
      })
      .filter(Boolean); // removes null values

    res.status(200).json({
      loggedInUserId,
      users: chatUsers,
    });
  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({ message: error.message });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.user.userId; 

   
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // 2. Create message document
    const message = await Message.create({
      chatId,
      senderId,
      text,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};


// export const getMessages = async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.chatId).populate(
//       "messages.senderId",
//       "name role"
//     );

//     if (!chat) return res.status(404).json({ message: "Chat not found" });

//     res.status(200).json(chat.messages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
