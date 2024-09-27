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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const mongoose_1 = require("mongoose");
const message_model_1 = require("../models/message.model");
const chat_service_1 = require("./chat.service");
const user_service_1 = require("./user.service");
const apiError_1 = __importDefault(require("../utils/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const getCloudinaryFilePublicIdFromUrl_1 = __importDefault(require("../utils/getCloudinaryFilePublicIdFromUrl"));
const deletePreviousFileFromCloudinary_1 = require("../utils/deletePreviousFileFromCloudinary");
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
                return message;
            }
            else {
                const chat = yield chat_service_1.ChatService.addNewChat({
                    isGroupChat: false,
                    participants: [receiver, data === null || data === void 0 ? void 0 : data.sender],
                });
                const result = yield message_model_1.Message.create(Object.assign(Object.assign({}, data), { chatId: (chat === null || chat === void 0 ? void 0 : chat._id) || (chat === null || chat === void 0 ? void 0 : chat.id) }));
                const newMessage = yield result.populate("sender");
                const message = this.messageSanitizer(newMessage);
                return message;
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
            var _a, _b, _c;
            const data = yield message_model_1.Message.findById(id);
            const message = this.messageSanitizer(data);
            if (!message) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Message was not found");
            }
            else {
                const chat = yield chat_service_1.ChatService.getSingleChat(new mongoose_1.Types.ObjectId(message === null || message === void 0 ? void 0 : message.chatId));
                if (((_a = chat === null || chat === void 0 ? void 0 : chat.lastMessage) === null || _a === void 0 ? void 0 : _a.id) === String(id)) {
                    const lastMessage = yield message_model_1.Message.find({ chatId: chat === null || chat === void 0 ? void 0 : chat.id })
                        .sort({ createdAt: -1 })
                        .limit(2);
                    yield chat_service_1.ChatService.updateLastMessageId(chat === null || chat === void 0 ? void 0 : chat.id, (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.length) > 0 ? (_b = lastMessage[1]) === null || _b === void 0 ? void 0 : _b._id : null);
                }
                yield message_model_1.Message.findByIdAndDelete(id);
                if ((message === null || message === void 0 ? void 0 : message.media) && ((_c = message === null || message === void 0 ? void 0 : message.media) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                    yield this.deleteMediaFromAMessage(message);
                }
            }
        });
    }
    deleteMessagesByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield message_model_1.Message.find({ chatId: chatId });
            const public_ids = [];
            messages === null || messages === void 0 ? void 0 : messages.forEach((message) => {
                var _a, _b;
                if ((message === null || message === void 0 ? void 0 : message.media) && ((_a = message === null || message === void 0 ? void 0 : message.media) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    (_b = message === null || message === void 0 ? void 0 : message.media) === null || _b === void 0 ? void 0 : _b.forEach((media) => {
                        const publicId = (0, getCloudinaryFilePublicIdFromUrl_1.default)(media === null || media === void 0 ? void 0 : media.url);
                        if (publicId) {
                            public_ids.push({ public_id: publicId });
                        }
                    });
                }
            });
            if ((public_ids === null || public_ids === void 0 ? void 0 : public_ids.length) > 0) {
                yield (0, deletePreviousFileFromCloudinary_1.deleteMultipleFileFromCloudinary)(public_ids);
            }
            // Finally, delete all messages by chatId
            yield message_model_1.Message.deleteMany({ chatId: chatId });
        });
    }
    deleteMediaFromAMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // delete media from cloudinary
            const urls = (_a = message === null || message === void 0 ? void 0 : message.media) === null || _a === void 0 ? void 0 : _a.map((media) => media === null || media === void 0 ? void 0 : media.url);
            const public_ids = [];
            urls.forEach((url) => {
                const publicId = (0, getCloudinaryFilePublicIdFromUrl_1.default)(url);
                if (publicId) {
                    public_ids.push({ public_id: publicId });
                }
            });
            yield (0, deletePreviousFileFromCloudinary_1.deleteMultipleFileFromCloudinary)(public_ids);
        });
    }
}
exports.MessageService = new Service();
