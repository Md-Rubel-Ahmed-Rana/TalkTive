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
exports.UploadFileController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const uploadSingleImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        ({
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Image not uploaded",
            data: null,
        });
    }
    else {
        const imageUrl = req.file.path;
        res.status(200).json({
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Image uploaded successfully!",
            data: imageUrl,
        });
    }
});
const uploadMultipleImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || req.files.length === 0) {
        res.status(200).json({
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Images not uploaded!",
            data: null,
        });
    }
    else {
        const imageUrls = req.files.map((file) => file.path);
        res.status(200).json({
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Images uploaded successfully!",
            data: imageUrls,
        });
    }
});
const uploadSingleFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(200).json({
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "File not uploaded!",
            data: null,
        });
    }
    else {
        const imageUrl = req.file.path;
        res.status(200).json({
            statusCode: http_status_1.default.OK,
            success: true,
            message: "File uploaded successfully!",
            data: imageUrl,
        });
    }
});
const uploadMultipleFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || req.files.length === 0) {
        res.status(200).json({
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Files not uploaded!",
            data: null,
        });
    }
    else {
        const fileUrls = req.files.map((file) => file.path);
        res.status(200).json({
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Files uploaded successfully!",
            data: fileUrls,
        });
    }
});
exports.UploadFileController = {
    uploadSingleImage,
    uploadMultipleImage,
    uploadSingleFile,
    uploadMultipleFile,
};
