import { Server as SocketIOServer } from "socket.io";
import { IGetMessage } from "../interfaces/message.interface";
import { UserService } from "../service/user.service";

const socketConnection = (io: SocketIOServer) => {
  io.on("connection", (socket) => {
    console.log("User connected. Socket ID:", socket?.id);

    // When a user joins, assign them to their own room based on their userId
    socket.on("join-room", async (userId) => {
      socket.join(userId);
      console.log(`User ${userId} has joined their own room.`);
      await UserService.makeOnlineStatusActive(userId);

      // Notify other users that this user is online
      socket.broadcast.emit("user-status", { userId, status: "online" });

      // start-typing-message event
      socket.on("start-typing-message", ({ chatId, receiver, sender }) => {
        socket.broadcast.emit("start-typing-message", {
          chatId,
          receiver,
          sender,
        });
      });
      socket.on("stop-typing-message", ({ chatId, receiver, sender }) => {
        socket.broadcast.emit("stop-typing-message", {
          chatId,
          receiver,
          sender,
        });
      });
      // Send a new message
      socket.on("send-message", (message: IGetMessage) => {
        socket.broadcast.emit("new-message", message);
        io.emit("chat-updated");
      });

      // Send edited message
      socket.on("edited-message", (message: IGetMessage) => {
        console.log("Got edited message", message);
        socket.broadcast.emit("edited-message", message);
        io.emit("chat-updated");
      });
      // Send edited message
      socket.on("deleted-message", (messageId: string) => {
        console.log("Got deleted message", messageId);
        socket.broadcast.emit("deleted-message", messageId);
        io.emit("chat-updated");
      });

      // Handle user-disconnect event
      socket.on("user-disconnect", async (disconnectedUser) => {
        console.log("User disconnected:", disconnectedUser);
        await UserService.makeOnlineStatusDeActive(disconnectedUser);

        socket.broadcast.emit("user-status", {
          userId: disconnectedUser,
          status: "offline",
        });
      });

      // Handle user disconnection
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  });
};

export default socketConnection;
