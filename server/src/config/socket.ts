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

      // Send a new message to a specific user room
      socket.on(
        "send-message",
        (targetUserId: string, message: IGetMessage) => {
          io.to(targetUserId).emit("new-message", message);
          io.emit("chat-updated");
          console.log(
            `Message sent from ${message?.sender?.id} to user ${targetUserId}`
          );
        }
      );

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
