// src/utils/socket.js
import { io } from "socket.io-client";
import { BACKEND_URL } from "./Constants"; // adjust path if different

let socket;

export const connectSocketClient = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"], // optional but avoids polling fallback
      path: "/socket.io", // <-- default on your server
    });
  }
  return socket;
};

export default connectSocketClient;
