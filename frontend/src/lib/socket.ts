import { io } from "socket.io-client";

const baseApiSocket = process.env.NEXT_PUBLIC_BASE_API_SOCKET as string;

export const socket = io(baseApiSocket, {
  transports: ["websocket"],
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});
