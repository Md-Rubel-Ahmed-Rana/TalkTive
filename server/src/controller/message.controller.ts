import { Request, Response } from "express";
import { MessageService } from "../service/message.service";
import RootController from "./rootController";
import httpStatus from "http-status";
import { Types } from "mongoose";

class Controller extends RootController {
  sendMessage = this.catchAsync(async (req: Request, res: Response) => {
    const receiver = req.params?.receiver as unknown as Types.ObjectId;
    const result = await MessageService.sendMessage(receiver, req.body);
    this.apiResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Message has been sent!",
      data: result,
    });
  });
  getMessagesByChatId = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params.chatId as unknown as Types.ObjectId;
    const participantId = req.params.participantId as unknown as Types.ObjectId;
    const messages = await MessageService.getMessagesByChatId(
      chatId,
      participantId
    );
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Messages found!",
      data: messages,
    });
  });
  updateMessage = this.catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const updatedMessage = await MessageService.updateMessage(
      id,
      req.body.content
    );
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Message updated!",
      data: updatedMessage,
    });
  });
  readMessages = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params.chatId as unknown as Types.ObjectId;
    const participantId = req.params.participantId as unknown as Types.ObjectId;
    await MessageService.readMessages(chatId, participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Marked all the unread messages as read!",
      data: null,
    });
  });
  deleteMessage = this.catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id as unknown as Types.ObjectId;
    const messageId = await MessageService.deleteMessage(id);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Message deleted!",
      data: messageId,
    });
  });
}
export const MessageController = new Controller();
