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
exports.ChatController = void 0;
const rootController_1 = __importDefault(require("./rootController"));
const chat_service_1 = require("../service/chat.service");
const http_status_1 = __importDefault(require("http-status"));
class Controller extends rootController_1.default {
    constructor() {
        super(...arguments);
        this.addNewChat = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (typeof req.body.participants === "string") {
                req.body.participants = JSON.parse(req.body.participants);
            }
            if (typeof req.body.groupRules === "string") {
                req.body.groupRules = JSON.parse(req.body.groupRules);
            }
            yield chat_service_1.ChatService.addNewChat(req.body);
            this.apiResponse(res, {
                statusCode: http_status_1.default.CREATED,
                success: true,
                message: "Group created successfully",
                data: null,
            });
        }));
        this.myChatList = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const participantId = req.params.participantId;
            const chatList = yield chat_service_1.ChatService.myChatList(participantId);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Chat list found!",
                data: chatList,
            });
        }));
        this.getSingleChat = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const chatId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            const chat = yield chat_service_1.ChatService.getSingleChat(chatId);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Chat found!",
                data: chat,
            });
        }));
        this.getChatByTwoParticipants = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const participant1 = (_a = req.params) === null || _a === void 0 ? void 0 : _a.participant1;
            const participant2 = (_b = req.params) === null || _b === void 0 ? void 0 : _b.participant2;
            const chat = yield chat_service_1.ChatService.getChatByTwoParticipants(participant1, participant2);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Chat found!",
                data: chat,
            });
        }));
        this.deleteChat = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const chatId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.chatId;
            yield chat_service_1.ChatService.deleteChat(chatId);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Group deleted successfully!",
                data: null,
            });
        }));
        this.updateChatInfo = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const chatId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.chatId;
            yield chat_service_1.ChatService.updateChatInfo(chatId, req.body);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Group updated successfully!",
                data: null,
            });
        }));
        this.changeGroupImage = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const chatId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.chatId;
            yield chat_service_1.ChatService.changeGroupImage(chatId, (_b = req.body) === null || _b === void 0 ? void 0 : _b.groupImage);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Group image changed successfully!",
                data: null,
            });
        }));
        this.addNewParticipant = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const chatId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.chatId;
            const participantId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.participantId;
            yield chat_service_1.ChatService.addNewParticipant(chatId, participantId);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Group member added!",
                data: null,
            });
        }));
        this.removeParticipant = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const chatId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.chatId;
            const participantId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.participantId;
            yield chat_service_1.ChatService.removeParticipant(chatId, participantId);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Group member removed!",
                data: null,
            });
        }));
    }
}
exports.ChatController = new Controller();
