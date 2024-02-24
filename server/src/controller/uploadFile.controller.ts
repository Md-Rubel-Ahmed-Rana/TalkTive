import { Request, Response } from "express";
import httpStatus from "http-status";

const uploadSingleImage = async (req: Request, res: Response) => {
  if (!req.file) {
    ({
      statusCode: httpStatus.OK,
      success: true,
      message: "Image not uploaded",
      data: null,
    });
  } else {
    const imageUrl = req.file.path;
    res.status(200).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Image uploaded successfully!",
      data: imageUrl,
    });
  }
};

const uploadMultipleImage = async (req: Request, res: Response) => {
  if (!req.files || req.files.length === 0) {
    res.status(200).json({
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Images not uploaded!",
      data: null,
    });
  } else {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file: Express.Multer.File) => file.path
    );
    res.status(200).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Images uploaded successfully!",
      data: imageUrls,
    });
  }
};

const uploadSingleFile = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(200).json({
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "File not uploaded!",
      data: null,
    });
  } else {
    const imageUrl = req.file.path;
    res.status(200).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "File uploaded successfully!",
      data: imageUrl,
    });
  }
};

const uploadMultipleFile = async (req: Request, res: Response) => {
  if (!req.files || req.files.length === 0) {
    res.status(200).json({
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Files not uploaded!",
      data: null,
    });
  } else {
    const fileUrls = (req.files as Express.Multer.File[]).map(
      (file: Express.Multer.File) => file.path
    );
    res.status(200).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Files uploaded successfully!",
      data: fileUrls,
    });
  }
};

export const UploadFileController = {
  uploadSingleImage,
  uploadMultipleImage,
  uploadSingleFile,
  uploadMultipleFile,
};
