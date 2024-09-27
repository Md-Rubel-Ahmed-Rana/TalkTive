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
exports.ChatService = void 0;
const chat_model_1 = require("../models/chat.model");
const chatSorter_1 = require("../utils/chatSorter");
const user_service_1 = require("./user.service");
const apiError_1 = __importDefault(require("../utils/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const getCloudinaryFilePublicIdFromUrl_1 = __importDefault(require("../utils/getCloudinaryFilePublicIdFromUrl"));
const deletePreviousFileFromCloudinary_1 = require("../utils/deletePreviousFileFromCloudinary");
const message_service_1 = require("./message.service");
class Service {
    lastMessageSanitizer(message) {
        return {
            id: (message === null || message === void 0 ? void 0 : message._id) && String(message === null || message === void 0 ? void 0 : message._id),
            chatId: message === null || message === void 0 ? void 0 : message.chatId,
            sender: message === null || message === void 0 ? void 0 : message.sender,
            content: message === null || message === void 0 ? void 0 : message.content,
            status: message === null || message === void 0 ? void 0 : message.status,
            media: message === null || message === void 0 ? void 0 : message.media,
            createdAt: message === null || message === void 0 ? void 0 : message.createdAt,
            updatedAt: message === null || message === void 0 ? void 0 : message.updatedAt,
        };
    }
    chatSanitizer(chat) {
        var _a;
        const participants = (_a = chat === null || chat === void 0 ? void 0 : chat.participants) === null || _a === void 0 ? void 0 : _a.map((user) => user_service_1.UserService.userSanitizer(user));
        const admin = user_service_1.UserService.userSanitizer(chat === null || chat === void 0 ? void 0 : chat.admin);
        const lastMessage = this.lastMessageSanitizer(chat === null || chat === void 0 ? void 0 : chat.lastMessage);
        return {
            id: (chat === null || chat === void 0 ? void 0 : chat._id) && String((chat === null || chat === void 0 ? void 0 : chat._id) || (chat === null || chat === void 0 ? void 0 : chat.id)),
            isGroupChat: chat === null || chat === void 0 ? void 0 : chat.isGroupChat,
            groupName: chat === null || chat === void 0 ? void 0 : chat.groupName,
            groupImage: chat === null || chat === void 0 ? void 0 : chat.groupImage,
            groupDescription: chat === null || chat === void 0 ? void 0 : chat.groupDescription,
            groupRules: chat === null || chat === void 0 ? void 0 : chat.groupRules,
            admin: admin,
            participants: participants,
            lastMessage: lastMessage,
            createdAt: chat === null || chat === void 0 ? void 0 : chat.createdAt,
            updatedAt: chat === null || chat === void 0 ? void 0 : chat.updatedAt,
        };
    }
    addNewChat(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newChat = yield chat_model_1.Chat.create(data);
            return newChat;
        });
    }
    myChatList(participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatList = yield chat_model_1.Chat.find({ participants: participantId }).populate([
                {
                    path: "admin",
                    model: "User",
                },
                {
                    path: "participants",
                    model: "User",
                },
                {
                    path: "lastMessage",
                    model: "Message",
                },
            ]);
            const chats = chatList.map((chat) => this.chatSanitizer(chat));
            const sortedChats = (0, chatSorter_1.sortChatsByLastMessage)(chats);
            return sortedChats;
        });
    }
    getSingleChat(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield chat_model_1.Chat.findById(chatId).populate([
                {
                    path: "admin",
                    model: "User",
                },
                {
                    path: "participants",
                    model: "User",
                },
                {
                    path: "lastMessage",
                    model: "Message",
                },
            ]);
            const chat = this.chatSanitizer(data);
            return chat;
        });
    }
    getChatByTwoParticipants(participant1, participant2) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield chat_model_1.Chat.findOne({
                participants: [participant1, participant2],
            }).populate([
                {
                    path: "admin",
                    model: "User",
                },
                {
                    path: "participants",
                    model: "User",
                },
                {
                    path: "lastMessage",
                    model: "Message",
                },
            ]);
            const chat = this.chatSanitizer(data);
            return chat;
        });
    }
    deleteChat(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield chat_model_1.Chat.findById(chatId);
            if (!isExist) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Chat was not found!");
            }
            else {
                // delete group image from cloudinary if exist
                if (isExist.groupImage) {
                    const publicId = (0, getCloudinaryFilePublicIdFromUrl_1.default)(isExist === null || isExist === void 0 ? void 0 : isExist.groupImage);
                    if (publicId) {
                        yield (0, deletePreviousFileFromCloudinary_1.deleteSingleFileFromCloudinary)(publicId);
                    }
                }
                yield chat_model_1.Chat.findByIdAndDelete(chatId);
                yield message_service_1.MessageService.deleteMessagesByChatId(chatId);
            }
        });
    }
    updateChatInfo(chatId, updatedChat) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield chat_model_1.Chat.findById(chatId);
            if (!chat) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Chat was not found!");
            }
            else {
                yield chat_model_1.Chat.findByIdAndUpdate(chatId, { $set: Object.assign({}, updatedChat) });
            }
        });
    }
    changeGroupImage(chatId, imageLink) {
        return __awaiter(this, void 0, void 0, function* () {
            if (imageLink) {
                const chat = yield chat_model_1.Chat.findById(chatId);
                if (!chat) {
                    throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Chat was not found!");
                }
                else {
                    if (chat === null || chat === void 0 ? void 0 : chat.groupImage) {
                        const publicId = (0, getCloudinaryFilePublicIdFromUrl_1.default)(chat === null || chat === void 0 ? void 0 : chat.groupImage);
                        if (publicId) {
                            yield (0, deletePreviousFileFromCloudinary_1.deleteSingleFileFromCloudinary)(publicId);
                        }
                        yield chat_model_1.Chat.findByIdAndUpdate(chatId, {
                            $set: { groupImage: imageLink },
                        });
                    }
                }
            }
            else {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, "Group image was not provided");
            }
        });
    }
    updateLastMessageId(chatId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chat_model_1.Chat.findByIdAndUpdate(chatId, { $set: { lastMessage: messageId } });
        });
    }
    addNewParticipant(chatId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chat_model_1.Chat.findByIdAndUpdate(chatId, {
                $push: { participants: participantId },
            });
        });
    }
    removeParticipant(chatId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chat_model_1.Chat.findByIdAndUpdate(chatId, {
                $pull: { participants: participantId },
            });
        });
    }
}
exports.ChatService = new Service();
