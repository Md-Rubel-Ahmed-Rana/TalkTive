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
exports.MessageController = void 0;
const message_service_1 = require("../service/message.service");
const rootController_1 = __importDefault(require("./rootController"));
const http_status_1 = __importDefault(require("http-status"));
class Controller extends rootController_1.default {
    constructor() {
        super(...arguments);
        this.sendMessage = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const receiver = req.params.receiver;
            const result = yield message_service_1.MessageService.sendMessage(receiver, req.body);
            this.apiResponse(res, {
                statusCode: http_status_1.default.CREATED,
                success: true,
                message: "Message has been sent!",
                data: result,
            });
        }));
        this.getMessagesByChatId = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const chatId = req.params.chatId;
            const messages = yield message_service_1.MessageService.getMessagesByChatId(chatId);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Messages found!",
                data: messages,
            });
        }));
        this.updateMessage = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield message_service_1.MessageService.updateMessage(id, req.body.content);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Message updated!",
                data: null,
            });
        }));
        this.deleteMessage = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            yield message_service_1.MessageService.deleteMessage(id);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Message deleted!",
                data: null,
            });
        }));
    }
}
exports.MessageController = new Controller();
