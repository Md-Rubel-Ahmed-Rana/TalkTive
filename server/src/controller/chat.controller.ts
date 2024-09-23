import { Request, Response } from "express";
import RootController from "./rootController";
import { ChatService } from "../service/chat.service";
import httpStatus from "http-status";
import { Types } from "mongoose";

class Controller extends RootController {
  addNewChat = this.catchAsync(async (req: Request, res: Response) => {
    const newChat = await ChatService.addNewChat(req.body);
    this.apiResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Chat created successfully",
      data: newChat,
    });
  });
  myChatList = this.catchAsync(async (req: Request, res: Response) => {
    const participantId = req.params.participantId;
    const chatList = await ChatService.myChatList(participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat list found!",
      data: chatList,
    });
  });
  getSingleChat = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.id as unknown as Types.ObjectId;
    const chat = await ChatService.getSingleChat(chatId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat found!",
      data: chat,
    });
  });
}

export const ChatController = new Controller();
