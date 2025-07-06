import io from "socket.io-client";
import { BACKEND_URL } from "./Constants";
let socket;

export const connectSocketClient = () => {
  if (location.hostname === "localhost") {
    if (!socket) {
      socket = io(BACKEND_URL);
    }
    return socket;
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};

export default connectSocketClient;
