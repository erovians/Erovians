import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.utils.js";

// send message in chat BY ANY USER WHICH IS LOGGED IN
export const sendMessage = async (req, res) => {
  // try {
  //   const { chatId, text } = req.body;
  //   const receiverId = req.user.userId;
  //   const senderId = "690ae30913ffba8b7869fd75";

  //   const message = await Message.create({
  //     chatId,
  //     senderId,
  //     receiverId,
  //     text,
  //     status: "unread",
  //   });

  //   res.status(201).json({ success: true, data: message });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }

  try {
    const { chatId, text } = req.body;
    // const senderId = req.user.userId; // logged-in user
    const senderId = req.user.userId;
    const receiverId = "690ae30913ffba8b7869fd75";

    let fileUrl = null;
    let fileType = null;

    // ✅ If user uploaded a file, send to Cloudinary
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path, req.file.mimetype);
      if (!result?.secure_url)
        return res.status(500).json({ message: "File upload failed" });

      fileUrl = result.secure_url;
      fileType = req.file.mimetype.startsWith("image/") ? "image" : "file";
    }

    // ✅ Create message (text + optional file)
    const message = await Message.create({
      chatId,
      senderId,
      receiverId,
      text: text || "",
      fileUrl,
      fileType,
      status: "unread",
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error("sendMessage failed:", error);
    res.status(500).json({ message: error.message });
  }
};

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
// export const getMyChatUsers = async (req, res) => {
//   try {
//     const loggedInUserId = req.user.userId;

//     const chats = await Chat.find({
//       $or: [
//         { "members.userId": loggedInUserId },
//         { "members.sellerId": loggedInUserId },
//       ],
//     })
//       .populate("members.userId")
//       .sort({ updatedAt: -1 });

//     const chatUsers = chats
//       .map((chat) => {
//         const { userId, sellerId } = chat.members;

//         if (!userId && !sellerId) return null;

//         let otherUser;

//         if (userId && userId._id?.toString() === loggedInUserId.toString()) {
//           otherUser = sellerId;
//         } else {
//           otherUser = userId;
//         }

//         // If otherUser is null (for safety), skip this chat
//         if (!otherUser) return null;

//         return {
//           chatId: chat._id.toString(),
//           user: otherUser,
//           lastMessage: chat.lastMessage || null,
//           lastMessageAt: chat.lastMessageAt || chat.updatedAt,
//         };
//       })
//       .filter(Boolean); // removes null values

//     res.status(200).json({
//       loggedInUserId,
//       users: chatUsers,
//     });
//   } catch (error) {
//     console.error("Error fetching chat users:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// second user (seller or user) will get all chat users
export const getMyChatUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

    const chats = await Chat.find({
      $or: [
        { "members.userId": loggedInUserId },
        { "members.sellerId": loggedInUserId },
      ],
    })
      .populate("members.userId")
      .sort({ updatedAt: -1 });

    const chatUsers = await Promise.all(
      chats.map(async (chat) => {
        const { userId, sellerId } = chat.members;

        let otherUser =
          userId && userId._id.toString() === loggedInUserId.toString()
            ? sellerId
            : userId;

        if (!otherUser) return null;

        // ✅ Count unread messages for this chat
        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          receiverId: loggedInUserId,
          status: "unread",
        });

        return {
          chatId: chat._id.toString(),
          user: otherUser,
          lastMessage: chat.lastMessage || null,
          lastMessageAt: chat.lastMessageAt || chat.updatedAt,
          unreadCount, // <— Add this
        };
      })
    );

    res.status(200).json({
      loggedInUserId,
      users: chatUsers.filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to Fetch Messages of a Chat
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { selectedUserId } = req.query;
    const loggedInUserId = req.user.userId;

    // 1. Validate chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // 2. Verify logged-in user is part of chat
    const isParticipant =
      chat.members.userId.toString() === loggedInUserId.toString() ||
      chat.members.sellerId.toString() === loggedInUserId.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied to this chat" });
    }

    // ✅ 3. Auto-Mark unread messages as read
    await Message.updateMany(
      {
        chatId,
        senderId: selectedUserId,
        receiverId: loggedInUserId,
        status: "unread",
      },
      { $set: { status: "read" } }
    );

    // 3. Filter messages exchanged only between these two users
    const messages = await Message.find({
      chatId,
      $or: [
        { senderId: loggedInUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: loggedInUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
