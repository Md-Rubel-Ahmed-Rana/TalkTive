"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("../service/user.service");
const socketConnection = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected. Socket ID:", socket === null || socket === void 0 ? void 0 : socket.id);
        // When a user joins, assign them to their own room based on their userId
        socket.on("join-room", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(userId);
            console.log(`User ${userId} has joined their own room.`);
            yield user_service_1.UserService.makeOnlineStatusActive(userId);
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
            socket.on("send-message", (message) => {
                socket.broadcast.emit("new-message", message);
                io.emit("chat-updated");
            });
            // Send edited message
            socket.on("edited-message", (message) => {
                console.log("Got edited message", message);
                socket.broadcast.emit("edited-message", message);
                io.emit("chat-updated");
            });
            // Send edited message
            socket.on("deleted-message", (messageId) => {
                console.log("Got deleted message", messageId);
                socket.broadcast.emit("deleted-message", messageId);
                io.emit("chat-updated");
            });
            // video calling events start here
            socket.on("send-video-call", (data) => {
                console.log("receive-video-call", data);
                socket.to(data === null || data === void 0 ? void 0 : data.receiver).emit("receive-video-call", data);
            });
            socket.on("decline-video-call", (data) => {
                console.log("decline-video-call");
                socket.to(data === null || data === void 0 ? void 0 : data.receiver).emit("decline-video-call", data);
            });
            socket.on("cancel-video-call", (data) => {
                console.log("cancel-video-call");
                socket.to(data === null || data === void 0 ? void 0 : data.receiver).emit("cancel-video-call", data);
            });
            socket.on("video-call-accepted", (data) => {
                console.log("video-call-accepted");
                socket.to(data === null || data === void 0 ? void 0 : data.receiver).emit("video-call-accepted", data);
            });
            // Handle ICE candidate event
            socket.on("ice-candidate", (data) => {
                console.log("Got ice-candidate");
                socket.broadcast.emit("ice-candidate", data);
            });
            // Handle offer event for WebRTC
            socket.on("offer", (data) => {
                socket.broadcast.emit("offer", data);
            });
            socket.on("answer", (data) => {
                socket.broadcast.emit("answer", data);
            });
            socket.on("video-call-end", (data) => {
                socket.to(data === null || data === void 0 ? void 0 : data.receiver).emit("video-call-end", data);
            });
            // video calling events end here
            // Handle user-disconnect event
            socket.on("user-disconnect", (disconnectedUser) => __awaiter(void 0, void 0, void 0, function* () {
                console.log("User disconnected:", disconnectedUser);
                yield user_service_1.UserService.makeOnlineStatusDeActive(disconnectedUser);
                socket.broadcast.emit("user-status", {
                    userId: disconnectedUser,
                    status: "offline",
                });
            }));
            // Handle user disconnection
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        }));
    });
};
exports.default = socketConnection;
