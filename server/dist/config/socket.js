"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketConnection = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected. Socket ID:", socket === null || socket === void 0 ? void 0 : socket.id);
        // When a user joins, assign them to their own room based on their userId
        socket.on("join-room", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} has joined their own room.`);
            // Notify other users that this user is online
            socket.broadcast.emit("user-status", { userId, status: "online" });
            // Send a new message to a specific user room
            socket.on("send-message", (targetUserId, message) => {
                var _a;
                io.to(targetUserId).emit("new-message", message);
                io.emit("chat-updated");
                console.log(`Message sent from ${(_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.id} to user ${targetUserId}`);
            });
            // Handle user disconnection
            socket.on("disconnect", () => {
                socket.broadcast.emit("user-status", { userId, status: "offline" });
                console.log("User disconnected:", socket.id);
            });
        });
    });
};
exports.default = socketConnection;
