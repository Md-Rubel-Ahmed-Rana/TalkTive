"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const express_1 = require("express");
const chat_controller_1 = require("../controller/chat.controller");
const router = (0, express_1.Router)();
router.post("/add-new-chat", chat_controller_1.ChatController.addNewChat);
router.get("/my-chat-list/:participantId", chat_controller_1.ChatController.myChatList);
exports.ChatRoutes = router;
