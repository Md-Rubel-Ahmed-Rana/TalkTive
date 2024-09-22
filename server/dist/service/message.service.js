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
const chat_service_1 = require("./chat.service");
const user_service_1 = require("./user.service");
class Service {
    mediaSanitizer(media) {
        return {
            id: (media === null || media === void 0 ? void 0 : media._id) && String((media === null || media === void 0 ? void 0 : media._id) || (media === null || media === void 0 ? void 0 : media.id)),
            type: media === null || media === void 0 ? void 0 : media.type,
            url: media === null || media === void 0 ? void 0 : media.url,
        };
    }
    messageSanitizer(message) {
        var _a;
        const sender = user_service_1.UserService.userSanitizer(message === null || message === void 0 ? void 0 : message.sender);
        const media = (_a = message === null || message === void 0 ? void 0 : message.media) === null || _a === void 0 ? void 0 : _a.map((mda) => this.mediaSanitizer(mda));
        return {
            id: (message === null || message === void 0 ? void 0 : message._id) && String((message === null || message === void 0 ? void 0 : message._id) || (message === null || message === void 0 ? void 0 : message.id)),
            chatId: message === null || message === void 0 ? void 0 : message.chatId,
            sender: sender,
            content: message === null || message === void 0 ? void 0 : message.content,
            status: message === null || message === void 0 ? void 0 : message.status,
            media: media,
            createdAt: message === null || message === void 0 ? void 0 : message.createdAt,
            updatedAt: message === null || message === void 0 ? void 0 : message.updatedAt,
        };
    }
    sendMessage(receiver, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data === null || data === void 0 ? void 0 : data.chatId) {
                const result = yield message_model_1.Message.create(data);
                const newMessage = yield result.populate("sender");
                const message = this.messageSanitizer(newMessage);
                console.log(`Emit message: ${message}`);
            }
            else {
                const chat = yield chat_service_1.ChatService.addNewChat({
                    isGroupChat: false,
                    participants: [receiver, data === null || data === void 0 ? void 0 : data.sender],
                });
                const result = yield message_model_1.Message.create(Object.assign(Object.assign({}, data), { chatId: (chat === null || chat === void 0 ? void 0 : chat._id) || (chat === null || chat === void 0 ? void 0 : chat.id) }));
                const newMessage = yield result.populate("sender");
                const message = this.messageSanitizer(newMessage);
                console.log(`Emit message: ${message}`);
            }
        });
    }
    getMessagesByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield message_model_1.Message.find({ chatId: chatId }).populate("sender");
            const messages = data === null || data === void 0 ? void 0 : data.map((msg) => this.messageSanitizer(msg));
            return messages;
        });
    }
    updateMessage(id, updatedContent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield message_model_1.Message.findByIdAndUpdate(id, { $set: { content: updatedContent } });
        });
    }
    deleteMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield message_model_1.Message.findByIdAndDelete(id);
        });
    }
}
exports.MessageService = new Service();
