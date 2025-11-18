import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:9001";
const TEST_USER_ID = "690ae30913ffba8b7869fd75";
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  auth: { userId: TEST_USER_ID },
});

socket.on("connect", () => {
  console.log("Connected as test user:", socket.id);
  socket.emit("addUser");
});

socket.on("getUsers", (users) => console.log("Active users:", users));
socket.on("getMessage", (msg) => console.log("Message:", msg));
socket.on("connect_error", (err) =>
  console.error("Connect error:", err.message)
);
