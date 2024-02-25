import { Request, Response } from "express";
import { MessageService } from "../service/message.service";

const sendMessage = async (req: Request, res: Response) => {
  const result = await MessageService.sendMessage(req.body);
  res.status(201).json({
    statusCode: 201,
    success: true,
    message: "Message created successfully",
    data: result,
  });
};

const getMessages = async (req: Request, res: Response) => {
  const sender = req.params.sender;
  const receiver = req.params.receiver;
  const result = await MessageService.getMessages(sender, receiver);
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Messages fetched successfully",
    data: result,
  });
};

const getAllMessages = async (req: Request, res: Response) => {
  const result = await MessageService.getAllMessages();
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Messages fetched successfully",
    data: result,
  });
};

export const MessageController = {
  sendMessage,
  getMessages,
  getAllMessages,
};
