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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jwt_1 = require("../middleware/jwt");
const user_service_1 = require("./user.service");
const apiError_1 = __importDefault(require("../utils/apiError"));
const bcrypt_1 = require("../utils/bcrypt");
class Service {
    checkUserExistence(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield user_service_1.UserService.findUserByEmailWithPassword(data === null || data === void 0 ? void 0 : data.email);
            const jwtPayload = {
                id: "",
                email: "",
            };
            if (isExist) {
                jwtPayload.id = isExist.id;
                jwtPayload.email = isExist.email;
                const accessToken = yield jwt_1.JwtInstance.generateAccessToken(jwtPayload);
                const refreshToken = yield jwt_1.JwtInstance.generateRefreshToken(jwtPayload);
                return { accessToken, refreshToken };
            }
            else {
                const result = yield user_service_1.UserService.createUser(data);
                jwtPayload.id = result === null || result === void 0 ? void 0 : result.id;
                jwtPayload.email = result === null || result === void 0 ? void 0 : result.email;
                const accessToken = yield jwt_1.JwtInstance.generateAccessToken(jwtPayload);
                const refreshToken = yield jwt_1.JwtInstance.generateRefreshToken(jwtPayload);
                return { accessToken, refreshToken };
            }
        });
    }
    auth(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_service_1.UserService.findUserById(id);
            return user;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield user_service_1.UserService.findUserByEmailWithPassword(email);
            if (!isExist) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
            }
            const isMatchedPassword = yield bcrypt_1.BcryptInstance.compare(password, isExist === null || isExist === void 0 ? void 0 : isExist.password);
            if (!isMatchedPassword) {
                throw new apiError_1.default(401, "Incorrect password");
            }
            const jwtPayload = {
                id: isExist === null || isExist === void 0 ? void 0 : isExist._id,
                email: isExist === null || isExist === void 0 ? void 0 : isExist.email,
            };
            const accessToken = yield jwt_1.JwtInstance.generateAccessToken(jwtPayload);
            const refreshToken = yield jwt_1.JwtInstance.generateRefreshToken(jwtPayload);
            const user = user_service_1.UserService.userSanitizer(isExist);
            return { accessToken, refreshToken, user };
        });
    }
}
exports.AuthService = new Service();
