import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import chatRoutes from "./routes/chat.routes.js";
import { setupSocket } from "./socket/socket.js";
const app = express();

// Enable JSON parsing for non-file routes
app.use(express.json({ limit: "10mb" }));

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.29.142:5173"],
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// Serve static files
app.use("/api/uploads", express.static("uploads"));

// Socket IO
app.use("/api/chat", chatRoutes);

// HTTP + Socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Setup socket events
setupSocket(io);

export { app };
