import { Request, Response } from "express";
import RootController from "./rootController";
import { ChatService } from "../service/chat.service";
import httpStatus from "http-status";

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
}

export const ChatController = new Controller();
