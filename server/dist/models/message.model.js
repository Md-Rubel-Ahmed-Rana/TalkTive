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
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const chat_model_1 = require("./chat.model");
const messageSchema = new mongoose_1.Schema({
    chatId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        require: false,
    },
    clearedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    readBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    media: [
        {
            type: {
                type: String,
                enum: ["image", "audio", "video", "document"],
                required: true,
            },
            url: { type: String, required: true },
        },
    ],
    status: {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
});
messageSchema.post("save", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield chat_model_1.Chat.findByIdAndUpdate(doc.chatId, { lastMessage: doc === null || doc === void 0 ? void 0 : doc._id });
        }
        catch (err) {
            console.error("Error updating lastMessage in Chat:", err);
        }
    });
});
exports.Message = (0, mongoose_1.model)("Message", messageSchema);
