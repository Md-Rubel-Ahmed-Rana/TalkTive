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
exports.UserController = void 0;
const user_service_1 = require("../service/user.service");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_service_1.UserService.register(req.body);
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Successfully register",
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Failed to register",
            error: error.message,
        });
    }
});
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_service_1.UserService.getUsers();
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Successfully fetched users",
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Failed to register",
            error: error.message,
        });
    }
});
const getSortedUsersToChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const users = yield user_service_1.UserService.getSortedUsersToChat(userId);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Sorted users fetched successfully",
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield user_service_1.UserService.login(req.body);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Successfully logged in",
            data: token,
        });
    }
    catch (error) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Failed to login",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
const auth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const user = yield user_service_1.UserService.auth(token);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Authentication success",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Failed to authenticate",
            data: null,
        });
    }
});
exports.UserController = {
    register,
    login,
    auth,
    getUsers,
    getSortedUsersToChat,
};
