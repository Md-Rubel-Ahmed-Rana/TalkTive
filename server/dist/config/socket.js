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
            // Send a new message to a specific user room
            socket.on("send-message", (targetUserId, message) => {
                var _a;
                io.to(targetUserId).emit("new-message", message);
                io.emit("chat-updated");
                console.log(`Message sent from ${(_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.id} to user ${targetUserId}`);
            });
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
