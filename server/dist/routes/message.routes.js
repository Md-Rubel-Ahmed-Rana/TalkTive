"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const express_1 = require("express");
const message_controller_1 = require("../controller/message.controller");
const cloudinary_1 = require("../middleware/cloudinary");
const router = (0, express_1.Router)();
router.post("/send/:sender/:receiver", cloudinary_1.upload.array("files"), (0, cloudinary_1.uploadMessageFiles)(), message_controller_1.MessageController.sendMessage);
router.get("/:chatId", message_controller_1.MessageController.getMessagesByChatId);
router.patch("/update/:id", message_controller_1.MessageController.updateMessage);
router.delete("/delete/:id", message_controller_1.MessageController.deleteMessage);
exports.MessageRoutes = router;
