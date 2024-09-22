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
            const newChat = yield chat_service_1.ChatService.addNewChat(req.body);
            this.apiResponse(res, {
                statusCode: http_status_1.default.CREATED,
                success: true,
                message: "Chat created successfully",
                data: newChat,
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
    }
}
exports.ChatController = new Controller();
