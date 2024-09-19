import multer from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { Request, Response, NextFunction } from "express";
import makeUrlFromFileObject from "../utils/makeUrlFromFileObject";
import { config } from "../config/environment";

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

export { upload, uploadProfileImage };
