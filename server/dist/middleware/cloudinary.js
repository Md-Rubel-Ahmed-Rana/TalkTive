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
exports.uploadMessageFiles = exports.uploadProfileImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const makeUrlFromFileObject_1 = __importDefault(require("../utils/makeUrlFromFileObject"));
const environment_1 = require("../config/environment");
const mime_types_1 = __importDefault(require("mime-types"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
exports.upload = upload;
const rootFolder = "talktive";
const uploadProfileImage = () => {
    const folder = `${rootFolder}/profile-pictures`;
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (req === null || req === void 0 ? void 0 : req.file) {
            try {
                const formData = new form_data_1.default();
                formData.append("file", fs_1.default.createReadStream((_a = req.file) === null || _a === void 0 ? void 0 : _a.path));
                const response = yield axios_1.default.post(`${environment_1.config.cloudinary.cloudinaryApi}/upload/single?folderName=${folder}`, formData, {
                    headers: Object.assign({}, formData.getHeaders()),
                });
                const extension = (_c = (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname) === null || _c === void 0 ? void 0 : _c.split(".").pop();
                const dataUrl = (0, makeUrlFromFileObject_1.default)(Object.assign(Object.assign({}, response.data.data), { extension }));
                req.body.image = dataUrl;
                next();
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message,
                    data: null,
                });
            }
            finally {
                fs_1.default.unlink(req.file.path, (err) => {
                    if (err)
                        console.error("Failed to delete uploaded file:", err);
                });
            }
        }
        else {
            next();
        }
    });
};
exports.uploadProfileImage = uploadProfileImage;
const uploadMessageFiles = () => {
    const folder = `${rootFolder}/messages`;
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const files = req.files || [];
        const media = [];
        if (files.length > 0) {
            for (const file of files) {
                const mimeType = mime_types_1.default.lookup(file.originalname);
                let targetFolder = "";
                let fileType = "document";
                if (mimeType && mimeType.includes("image")) {
                    targetFolder = `${folder}/images`;
                    fileType = "image";
                }
                else if (mimeType && mimeType.includes("video")) {
                    targetFolder = `${folder}/videos`;
                    fileType = "video";
                }
                else if (mimeType && mimeType.includes("audio")) {
                    targetFolder = `${folder}/audios`;
                    fileType = "audio";
                }
                else {
                    targetFolder = `${folder}/documents`;
                    fileType = "document";
                }
                const urls = yield handleUpload([file], targetFolder);
                urls.forEach((url) => {
                    media.push({
                        type: fileType,
                        url: url,
                    });
                });
            }
            req.body = Object.assign(Object.assign({}, req.body), { media });
        }
        next();
    });
};
exports.uploadMessageFiles = uploadMessageFiles;
const handleUpload = (files, folder) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uploadedFiles = [];
    const formData = new form_data_1.default();
    files.forEach((file) => {
        formData.append("files", fs_1.default.createReadStream(file.path));
    });
    try {
        const response = yield axios_1.default.post(`${environment_1.config.cloudinary.cloudinaryApi}/upload/many?folderName=${folder}`, formData, {
            headers: formData.getHeaders(),
        });
        (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data.forEach((obj, index) => {
            var _a, _b;
            const extension = (_b = (_a = files[index]) === null || _a === void 0 ? void 0 : _a.originalname) === null || _b === void 0 ? void 0 : _b.split(".").pop();
            const dataUrl = (0, makeUrlFromFileObject_1.default)(Object.assign(Object.assign({}, obj), { extension: extension }));
            uploadedFiles.push(dataUrl);
        });
    }
    catch (error) {
        console.error("Failed to upload files:", error);
    }
    finally {
        files.forEach((file) => {
            fs_1.default.unlink(file.path, (err) => {
                if (err)
                    console.error("Failed to delete uploaded file:", err);
            });
        });
    }
    return uploadedFiles;
});
