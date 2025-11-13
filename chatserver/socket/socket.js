let activeUsers = [];

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    // Add new user
    socket.on("addUser", (userId) => {
      const isExist = activeUsers.find((user) => user.userId === userId);
      if (!isExist) {
        activeUsers.push({ userId, socketId: socket.id });
        console.log("🟢 Active users:", activeUsers);
      }
      io.emit("getUsers", activeUsers);
    });

    // Send message to specific user
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const receiver = activeUsers.find((user) => user.userId === receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", { senderId, text });
      }
    });

    // Remove disconnected user
    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getUsers", activeUsers);
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
