"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    title: {
        type: String,
        default: "",
    },
    about: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["online", "offline"],
        default: "online",
    },
    links: [
        {
            name: {
                type: String,
            },
            url: {
                type: String,
            },
        },
    ],
    lastActive: {
        type: Date,
        default: Date.now(),
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
