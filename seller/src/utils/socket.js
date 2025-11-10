import { io } from "socket.io-client";

const URL = "http://localhost:9001";

export const socket = io(URL, {
  auth: { token: localStorage.getItem("accessToken") },
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};
