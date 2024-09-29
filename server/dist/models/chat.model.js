"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    deletedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    groupName: {
        type: String,
        default: null,
    },
    groupImage: {
        type: String,
        default: null,
    },
    groupDescription: {
        type: String,
        default: null,
    },
    groupRules: [String],
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    lastMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
});
exports.Chat = (0, mongoose_1.model)("Chat", chatSchema);
