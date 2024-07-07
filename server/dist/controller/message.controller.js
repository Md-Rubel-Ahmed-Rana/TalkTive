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
exports.MessageController = void 0;
const message_service_1 = require("../service/message.service");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_service_1.MessageService.sendMessage(req.body);
    res.status(201).json({
        statusCode: 201,
        success: true,
        message: "Message created successfully",
        data: result,
    });
});
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = req.params.sender;
    const receiver = req.params.receiver;
    const result = yield message_service_1.MessageService.getMessages(sender, receiver);
    res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Messages fetched successfully",
        data: result,
    });
});
const getLastMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_service_1.MessageService.getLastMessage();
    res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Last Message fetched successfully",
        data: result,
    });
});
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_service_1.MessageService.getAllMessages();
    res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Messages fetched successfully",
        data: result,
    });
});
exports.MessageController = {
    sendMessage,
    getMessages,
    getAllMessages,
    getLastMessage,
};
