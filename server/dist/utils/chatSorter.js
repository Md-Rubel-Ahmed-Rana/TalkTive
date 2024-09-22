"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortChatsByLastMessage = void 0;
const sortChatsByLastMessage = (chats) => {
    return chats.sort((a, b) => {
        var _a, _b;
        const lastMessageDateA = ((_a = a.lastMessage) === null || _a === void 0 ? void 0 : _a.createdAt) || a.createdAt;
        const lastMessageDateB = ((_b = b.lastMessage) === null || _b === void 0 ? void 0 : _b.createdAt) || b.createdAt;
        return (new Date(lastMessageDateB).getTime() -
            new Date(lastMessageDateA).getTime());
    });
};
exports.sortChatsByLastMessage = sortChatsByLastMessage;
