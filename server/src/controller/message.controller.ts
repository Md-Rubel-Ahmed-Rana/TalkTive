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
  const result = await MessageService.getMessages(req.params.conversationId);
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
};
