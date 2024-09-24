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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const rootController_1 = __importDefault(require("./rootController"));
const auth_service_1 = require("../service/auth.service");
const cookie_1 = require("../utils/cookie");
class Controller extends rootController_1.default {
    constructor() {
        super(...arguments);
        this.auth = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req === null || req === void 0 ? void 0 : req.id;
            const result = yield auth_service_1.AuthService.auth(id);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "User fetched  successfully",
                data: result,
            });
        }));
        this.login = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
<<<<<<< HEAD
            const { accessToken, refreshToken } = yield auth_service_1.AuthService.login(email, password);
=======
            const { accessToken, refreshToken, user } = yield auth_service_1.AuthService.login(email, password);
>>>>>>> 5b2ebb31d0762f62a04fc375ea7785cd3c12bf89
            cookie_1.cookieManager.setTokens(res, accessToken, refreshToken);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Login successful",
<<<<<<< HEAD
                data: null,
=======
                data: user,
>>>>>>> 5b2ebb31d0762f62a04fc375ea7785cd3c12bf89
            });
        }));
        this.logout = this.catchAsync((req, res) => __awaiter(this, void 0, void 0, function* () {
            cookie_1.cookieManager.clearTokens(res);
            this.apiResponse(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Logout successful",
                data: null,
            });
        }));
    }
}
exports.AuthController = new Controller();
