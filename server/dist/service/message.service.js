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
exports.MessageService = void 0;
const message_model_1 = require("../models/message.model");
const sendMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.Message.create(data);
    yield result.populate([
        {
            path: "sender",
            model: "User",
            select: {
                name: 1,
                image: 1,
            },
        },
        {
            path: "receiver",
            model: "User",
            select: {
                name: 1,
                image: 1,
            },
        },
    ]);
    return result;
});
const getMessages = (sender, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(sender, receiver);
    if (sender === undefined && receiver === undefined) {
        const result = yield message_model_1.Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        }).populate([
            {
                path: "sender",
                model: "User",
                select: {
                    name: 1,
                    image: 1,
                },
            },
            {
                path: "receiver",
                model: "User",
                select: {
                    name: 1,
                    image: 1,
                },
            },
        ]);
        return result;
    }
    else {
        return [];
    }
});
const getLastMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.Message.find({}).sort({ created: -1 });
    return result[0];
});
const getAllMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.Message.find({}).populate([
        {
            path: "sender",
            model: "User",
            select: {
                name: 1,
                image: 1,
            },
        },
        {
            path: "receiver",
            model: "User",
            select: {
                name: 1,
                image: 1,
            },
        },
    ]);
    return result;
});
exports.MessageService = {
    sendMessage,
    getMessages,
    getAllMessages,
    getLastMessage,
};
