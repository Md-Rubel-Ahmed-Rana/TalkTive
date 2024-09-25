import multer, { Multer } from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { Request, Response, NextFunction } from "express";
import makeUrlFromFileObject from "../utils/makeUrlFromFileObject";
import { config } from "../config/environment";
import mime from "mime-types";

const upload = multer({ dest: "uploads/" });
const rootFolder = "talktive";

const uploadProfileImage = () => {
  const folder = `${rootFolder}/profile-pictures`;
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req?.file) {
      try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file?.path));

        const response = await axios.post(
          `${config.cloudinary.cloudinaryApi}/upload/single?folderName=${folder}`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          }
        );

        const extension = req.file?.originalname?.split(".").pop();

        const dataUrl = makeUrlFromFileObject({
          ...response.data.data,
          extension,
        });

        req.body.image = dataUrl;
        next();
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          message: error.message,
          data: null,
        });
      } finally {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete uploaded file:", err);
        });
      }
    } else {
      next();
    }
  };
};

const uploadGroupImage = () => {
  const folder = `${rootFolder}/group-images`;
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req?.file) {
      try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file?.path));

        const response = await axios.post(
          `${config.cloudinary.cloudinaryApi}/upload/single?folderName=${folder}`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          }
        );

        const extension = req.file?.originalname?.split(".").pop();

        const dataUrl = makeUrlFromFileObject({
          ...response.data.data,
          extension,
        });

        req.body.groupImage = dataUrl;
        next();
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          message: error.message,
          data: null,
        });
      } finally {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete uploaded file:", err);
        });
      }
    } else {
      next();
    }
  };
};

const uploadMessageFiles = () => {
  const folder = `${rootFolder}/messages`;

  return async (req: Request, res: Response, next: NextFunction) => {
    const files = (req.files as Express.Multer.File[]) || [];
    const media: { type: string; url: string }[] = [];

    if (files.length > 0) {
      for (const file of files) {
        const mimeType = mime.lookup(file.originalname);
        let targetFolder = "";
        let fileType = "document";

        if (mimeType && mimeType.includes("image")) {
          targetFolder = `${folder}/images`;
          fileType = "image";
        } else if (mimeType && mimeType.includes("video")) {
          targetFolder = `${folder}/videos`;
          fileType = "video";
        } else if (mimeType && mimeType.includes("audio")) {
          targetFolder = `${folder}/audios`;
          fileType = "audio";
        } else {
          targetFolder = `${folder}/documents`;
          fileType = "document";
        }

        const urls = await handleUpload([file], targetFolder);
        urls.forEach((url) => {
          media.push({
            type: fileType,
            url: url,
          });
        });
      }

      req.body = { ...req.body, media };
    }

    next();
  };
};

const handleUpload = async (
  files: Express.Multer.File[],
  folder: string
): Promise<string[]> => {
  const uploadedFiles: string[] = [];
  const formData = new FormData();

  files.forEach((file: any) => {
    formData.append("files", fs.createReadStream(file.path));
  });

  try {
    const response = await axios.post(
      `${config.cloudinary.cloudinaryApi}/upload/many?folderName=${folder}`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    response?.data?.data.forEach((obj: any, index: number) => {
      const extension = files[index]?.originalname?.split(".").pop();
      const dataUrl = makeUrlFromFileObject({
        ...obj,
        extension: extension,
      });
      uploadedFiles.push(dataUrl);
    });
  } catch (error) {
    console.error("Failed to upload files:", error);
  } finally {
    files.forEach((file: any) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    });
  }

  return uploadedFiles;
};

export { upload, uploadProfileImage, uploadMessageFiles, uploadGroupImage };
