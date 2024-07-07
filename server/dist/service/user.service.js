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
exports.UserService = void 0;
const sendResponse_1 = require("../middleware/sendResponse");
const message_model_1 = require("../models/message.model");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(user.password, 12);
    user.password = hashedPassword;
    const newUser = yield user_model_1.User.create(user);
    return newUser;
});
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({}).select({ name: 1, image: 1, email: 1 });
    return users;
});
const getSortedUsersToChat = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find all distinct users the current user has communicated with
    console.log({ userId });
    const distinctUsers = yield message_model_1.Message.distinct("sender", { receiver: userId });
    distinctUsers.push(...(yield message_model_1.Message.distinct("receiver", { sender: userId })));
    // Find the latest message for each user
    const latestMessages = yield Promise.all(distinctUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const latestMessage = yield message_model_1.Message.findOne({
            $or: [
                { sender: userId, receiver: user },
                { sender: user, receiver: userId },
            ],
        }).sort({ createdAt: -1 });
        return latestMessage;
    })));
    // Sort users based on the latest message's creation date
    const users = yield user_model_1.User.find({ _id: { $in: distinctUsers } }).select({
        name: 1,
        image: 1,
    });
    users.sort((a, b) => {
        const messageA = latestMessages.find((message) => message.sender.toString() === a._id.toString() ||
            message.receiver.toString() === a._id.toString());
        const messageB = latestMessages.find((message) => message.sender.toString() === b._id.toString() ||
            message.receiver.toString() === b._id.toString());
        return (messageB === null || messageB === void 0 ? void 0 : messageB.createdAt) - (messageA === null || messageA === void 0 ? void 0 : messageA.createdAt);
    });
    return users;
});
const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: credentials === null || credentials === void 0 ? void 0 : credentials.email });
    if (!user) {
        return "User not found";
    }
    else {
        const matchedPassword = yield bcrypt_1.default.compare(credentials === null || credentials === void 0 ? void 0 : credentials.password, user === null || user === void 0 ? void 0 : user.password);
        if (!matchedPassword) {
            return "Invalid credentials";
        }
        else {
            const payload = {
                id: user === null || user === void 0 ? void 0 : user.id,
                email: user.email,
            };
            const accessToken = yield jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" });
            return accessToken;
        }
    }
});
const auth = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyUser = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!verifyUser) {
        return (0, sendResponse_1.sendResponse)({
            statusCode: 400,
            success: false,
            message: "Invalid token",
            data: null,
        });
    }
    else {
        const user = yield user_model_1.User.findById(verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.id).select({
            name: 1,
            email: 1,
            image: 1,
        });
        return user;
    }
});
exports.UserService = {
    register,
    login,
    auth,
    getUsers,
    getSortedUsersToChat,
};
