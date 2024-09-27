"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const express_1 = require("express");
const chat_controller_1 = require("../controller/chat.controller");
const cloudinary_1 = require("../middleware/cloudinary");
const router = (0, express_1.Router)();
router.post("/add-new-chat", cloudinary_1.upload.single("groupImage"), (0, cloudinary_1.uploadGroupImage)(), chat_controller_1.ChatController.addNewChat);
router.get("/my-chat-list/:participantId", chat_controller_1.ChatController.myChatList);
router.get("/:id", chat_controller_1.ChatController.getSingleChat);
router.get("/single/:participant1/:participant2", chat_controller_1.ChatController.getChatByTwoParticipants);
router.patch("/add-new-participant/:chatId/:participantId", chat_controller_1.ChatController.addNewParticipant);
router.patch("/remove-participant/:chatId/:participantId", chat_controller_1.ChatController.removeParticipant);
router.patch("/update/:chatId", chat_controller_1.ChatController.updateChatInfo);
router.patch("/change-group-image/:chatId", cloudinary_1.upload.single("groupImage"), (0, cloudinary_1.uploadGroupImage)(), chat_controller_1.ChatController.changeGroupImage);
router.delete("/delete/:chatId", chat_controller_1.ChatController.deleteChat);
exports.ChatRoutes = router;
