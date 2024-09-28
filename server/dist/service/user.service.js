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
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../models/user.model");
const apiError_1 = __importDefault(require("../utils/apiError"));
const bcrypt_1 = require("../utils/bcrypt");
const getCloudinaryFilePublicIdFromUrl_1 = __importDefault(require("../utils/getCloudinaryFilePublicIdFromUrl"));
const deletePreviousFileFromCloudinary_1 = require("../utils/deletePreviousFileFromCloudinary");
const chat_service_1 = require("./chat.service");
class Service {
    userSanitizer(user) {
        var _a;
        const links = (_a = user === null || user === void 0 ? void 0 : user.links) === null || _a === void 0 ? void 0 : _a.map((link) => ({
            id: (link === null || link === void 0 ? void 0 : link._id) && String((link === null || link === void 0 ? void 0 : link._id) || (link === null || link === void 0 ? void 0 : link.id)),
            name: link === null || link === void 0 ? void 0 : link.name,
            url: link === null || link === void 0 ? void 0 : link.url,
        }));
        return {
            id: (user === null || user === void 0 ? void 0 : user._id) && String(user === null || user === void 0 ? void 0 : user._id),
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            image: user === null || user === void 0 ? void 0 : user.image,
            title: user === null || user === void 0 ? void 0 : user.title,
            about: user === null || user === void 0 ? void 0 : user.about,
            links: links,
            status: user === null || user === void 0 ? void 0 : user.status,
            lastActive: user === null || user === void 0 ? void 0 : user.lastActive,
            createdAt: user === null || user === void 0 ? void 0 : user.createdAt,
            updatedAt: user === null || user === void 0 ? void 0 : user.updatedAt,
        };
    }
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.password = yield bcrypt_1.BcryptInstance.hash(user.password);
            yield user_model_1.User.create(user);
        });
    }
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.User.create(newUser);
            const user = this.userSanitizer(data);
            return user;
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.User.findById(id);
            const user = this.userSanitizer(data);
            return user;
        });
    }
    findUserByEmailWithPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.User.findOne({ email: email });
        });
    }
    getSingleUserInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.User.findById(id);
            const user = this.userSanitizer(data);
            return user;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const usersData = yield user_model_1.User.find({});
            const users = usersData === null || usersData === void 0 ? void 0 : usersData.map((user) => this.userSanitizer(user));
            return users;
        });
    }
    getUsersExceptExistingParticipants(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield chat_service_1.ChatService.getSingleChat(chatId);
            const participantIds = chat.participants.map((participant) => participant === null || participant === void 0 ? void 0 : participant.id);
            const usersData = yield user_model_1.User.find({
                _id: { $nin: participantIds },
            });
            const users = usersData === null || usersData === void 0 ? void 0 : usersData.map((user) => this.userSanitizer(user));
            return users;
        });
    }
    updateProfilePicture(id, imageLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findById(id);
            if (!user) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User was not found!");
            }
            else {
                const publicId = (0, getCloudinaryFilePublicIdFromUrl_1.default)(user === null || user === void 0 ? void 0 : user.image);
                if (publicId) {
                    yield (0, deletePreviousFileFromCloudinary_1.deleteSingleFileFromCloudinary)(publicId);
                }
                yield user_model_1.User.findByIdAndUpdate(id, { $set: { image: imageLink } });
            }
        });
    }
    updateUserInfo(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_model_1.User.findByIdAndUpdate(id, { $set: Object.assign({}, updateData) });
        });
    }
    updatePassword(id, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.BcryptInstance.hash(newPassword);
            yield user_model_1.User.findByIdAndUpdate(id, { $set: { password: hashedPassword } });
        });
    }
    makeOnlineStatusActive(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Make online", userId);
            yield user_model_1.User.findByIdAndUpdate(userId, {
                $set: { status: "online", lastActive: null },
            });
        });
    }
    makeOnlineStatusDeActive(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Make offline", userId);
            yield user_model_1.User.findByIdAndUpdate(userId, {
                $set: { status: "offline", lastActive: new Date().toISOString() },
            });
        });
    }
}
exports.UserService = new Service();
