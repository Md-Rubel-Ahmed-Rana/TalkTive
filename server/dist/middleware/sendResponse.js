"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (response) => {
    return (req, res) => {
        res.status(response.statusCode).json(response);
    };
};
exports.sendResponse = sendResponse;
