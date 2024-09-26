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
exports.UserController = void 0;
const user_service_1 = require("../service/user.service");
const rootController_1 = __importDefault(require("./rootController"));
const http_status_1 = __importDefault(require("http-status"));
const cookie_1 = require("../utils/cookie");
class Controller extends rootController_1.default {
    constructor() {
        super(...arguments);
        this.register = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield user_service_1.UserService.register(req.body);
            this.apiResponse(res, {
                statusCode: http_status_1.default.CREATED,
                success: true,
                message: "User registration successful!",
                data: null,
            });
        }));
        this.getUsers = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield user_service_1.UserService.getUsers();
            this.apiResponse(res, {
                statusCode: 200,
                success: true,
                message: "Users found!",
                data: users,
            });
        }));
        this.getUsersExceptExistingParticipants = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const chatId = req.params.chatId;
            const users = yield user_service_1.UserService.getUsersExceptExistingParticipants(chatId);
            this.apiResponse(res, {
                statusCode: 200,
                success: true,
                message: "Search users!",
                data: users,
            });
        }));
        this.getSingleUserInfo = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const user = yield user_service_1.UserService.getSingleUserInfo(userId);
            this.apiResponse(res, {
                statusCode: 200,
                success: true,
                message: "User info found!",
                data: user,
            });
        }));
        this.updateProfilePicture = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            console.log(req.body);
            yield user_service_1.UserService.updateProfilePicture(userId, req.body.image);
            this.apiResponse(res, {
                statusCode: 200,
                success: true,
                message: "Profile picture updated!",
                data: null,
            });
        }));
        this.updateUserInfo = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            yield user_service_1.UserService.updateUserInfo(userId, req.body);
            this.apiResponse(res, {
                statusCode: 200,
                success: true,
                message: "User info updated!",
                data: null,
            });
        }));
        this.updatePassword = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            yield user_service_1.UserService.updatePassword(userId, req.body.password);
            cookie_1.cookieManager.clearTokens(res);
            this.apiResponse(res, {
                statusCode: 200,
                success: true,
                message: "Your password was changed!",
                data: null,
            });
        }));
    }
}
exports.UserController = new Controller();
