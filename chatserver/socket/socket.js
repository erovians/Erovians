import jwt from "jsonwebtoken";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

// Keep your array style for compatibility
let activeUsers = [];

/**
 * Helper: add user to activeUsers using socket.user.userId
 */
function registerActiveUser(userId, socketId) {
  const exists = activeUsers.find((u) => u.userId === userId);
  if (!exists) activeUsers.push({ userId, socketId });
}

/**
 * Helper: remove socket on disconnect
 */
function unregisterSocket(socketId) {
  activeUsers = activeUsers.filter((u) => u.socketId !== socketId);
}

/**
 * Helper: find a user's active socket
 */
function findUserSocket(userId) {
  return activeUsers.find((u) => String(u.userId) === String(userId));
}

export const setupSocket = (io) => {
  // 🔐 JWT auth for sockets
  io.use((socket, next) => {
    try {
      // Accept token via auth, header, or query
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1] ||
        socket.handshake.query?.token;

      if (!token) return next(new Error("Unauthorized: no token"));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
        issuer: "erovians-ecommerce-app",
      });

      socket.user = { userId: decoded.userId, role: decoded.role };
      return next();
    } catch (err) {
      return next(new Error("Unauthorized: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { userId } = socket.user || {};
    console.log("⚡ User connected:", socket.id, "as:", userId);

    // auto-register on connect (no need for addUser, but we still support it)
    registerActiveUser(userId, socket.id);
    io.emit("getUsers", activeUsers);

    // ✅ still support your existing "addUser" event (optional)
    socket.on("addUser", (clientUserId) => {
      // ignore clientUserId for security; trust JWT userId
      registerActiveUser(userId, socket.id);
      io.emit("getUsers", activeUsers);
    });

    /**
     * ✅ Send message
     * payload: { chatId, receiverId, text }
     * We will:
     *  1) validate chat & membership
     *  2) persist message
     *  3) update chat lastMessage
     *  4) emit to receiver if online, and echo to sender as well
     */
    socket.on("sendMessage", async ({ chatId, receiverId, text }, ack) => {
      try {
        if (!chatId || !text) throw new Error("chatId and text are required");

        const chat = await Chat.findById(chatId).lean();
        if (!chat) throw new Error("Chat not found");

        // ensure the sender belongs to the chat
        const isMember =
          String(chat.members?.userId) === String(userId) ||
          String(chat.members?.sellerId) === String(userId);
        if (!isMember) throw new Error("Not a member of this chat");

        // (optional) ensure receiver is the other member
        if (
          receiverId &&
          ![
            String(chat.members?.userId),
            String(chat.members?.sellerId),
          ].includes(String(receiverId))
        ) {
          throw new Error("Receiver is not part of this chat");
        }

        // 2) Persist message
        const msg = await Message.create({
          chatId,
          senderId: userId,
          text,
        });

        // 3) Update last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: text,
          lastMessageAt: new Date(),
        });

        // Prepare payload
        const payload = {
          _id: msg._id.toString(),
          chatId: String(chatId),
          text,
          senderId: String(userId),
          createdAt: msg.createdAt,
        };

        // 4) Emit to receiver if online
        if (receiverId) {
          const receiver = findUserSocket(receiverId);
          if (receiver) {
            io.to(receiver.socketId).emit("getMessage", payload);
          }
        }

        // Echo back to sender (so sender's UI updates immediately)
        io.to(socket.id).emit("getMessage", payload);

        ack?.({ ok: true, data: payload });
      } catch (err) {
        console.error("sendMessage error:", err.message);
        ack?.({ ok: false, error: err.message });
      }
    });

    // Optional typing indicators
    socket.on("typing", ({ chatId }) => {
      // broadcast to all (or only to the other user if you track them)
      socket.broadcast.emit("typing", { chatId, from: userId });
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.broadcast.emit("stopTyping", { chatId, from: userId });
    });

    socket.on("disconnect", () => {
      unregisterSocket(socket.id);
      io.emit("getUsers", activeUsers);
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
