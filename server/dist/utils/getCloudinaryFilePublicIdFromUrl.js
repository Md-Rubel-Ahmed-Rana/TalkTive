"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractCloudinaryPublicId = (url) => {
    const regex = /public_id=([^?]+)/;
    const match = url.match(regex);
    if (match) {
        const public_id = match[1];
        console.log(`Remove cloudinary file of public_id: ${public_id}`);
        return public_id;
    }
    else {
        console.log("This is not  cloudinary file");
        return null;
    }
};
exports.default = extractCloudinaryPublicId;
