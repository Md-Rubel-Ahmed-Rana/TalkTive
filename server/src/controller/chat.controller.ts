import { Request, Response } from "express";
import RootController from "./rootController";
import { ChatService } from "../service/chat.service";
import httpStatus from "http-status";
import { Types } from "mongoose";

class Controller extends RootController {
  addNewChat = this.catchAsync(async (req: Request, res: Response) => {
    if (typeof req.body.participants === "string") {
      req.body.participants = JSON.parse(req.body.participants);
    }
    if (typeof req.body.groupRules === "string") {
      req.body.groupRules = JSON.parse(req.body.groupRules);
    }
    await ChatService.addNewChat(req.body);
    this.apiResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Group created successfully",
      data: null,
    });
  });

  myChatList = this.catchAsync(async (req: Request, res: Response) => {
    const participantId = req.params.participantId as unknown as Types.ObjectId;
    const chatList = await ChatService.myChatList(participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat list found!",
      data: chatList,
    });
  });
  getDeletedChatList = this.catchAsync(async (req: Request, res: Response) => {
    const participantId = req.params.participantId as unknown as Types.ObjectId;
    const chatList = await ChatService.getDeletedChatList(participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Deleted chat list found!",
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

  getChatByTwoParticipants = this.catchAsync(
    async (req: Request, res: Response) => {
      const participant1 = req.params
        ?.participant1 as unknown as Types.ObjectId;
      const participant2 = req.params
        ?.participant2 as unknown as Types.ObjectId;
      const chat = await ChatService.getChatByTwoParticipants(
        participant1,
        participant2
      );
      this.apiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Chat found!",
        data: chat,
      });
    }
  );

  deleteChat = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.chatId as unknown as Types.ObjectId;
    await ChatService.deleteChat(chatId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Group deleted successfully!",
      data: null,
    });
  });

  updateChatInfo = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.chatId as unknown as Types.ObjectId;
    await ChatService.updateChatInfo(chatId, req.body);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Group updated successfully!",
      data: null,
    });
  });

  changeGroupImage = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.chatId as unknown as Types.ObjectId;
    await ChatService.changeGroupImage(chatId, req.body?.groupImage);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Group image changed successfully!",
      data: null,
    });
  });

  addNewParticipant = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.chatId as unknown as Types.ObjectId;
    const participantId = req.params
      ?.participantId as unknown as Types.ObjectId;
    await ChatService.addNewParticipant(chatId, participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Group member added!",
      data: null,
    });
  });

  removeParticipant = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.chatId as unknown as Types.ObjectId;
    const participantId = req.params
      ?.participantId as unknown as Types.ObjectId;
    await ChatService.removeParticipant(chatId, participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Group member removed!",
      data: null,
    });
  });

  chatDeletedBy = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.chatId as unknown as Types.ObjectId;
    const participantId = req.params
      ?.participantId as unknown as Types.ObjectId;
    await ChatService.chatDeletedBy(chatId, participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat deleted successfully!!",
      data: null,
    });
  });

  restoreDeletedChat = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.chatId as unknown as Types.ObjectId;
    const participantId = req.params
      ?.participantId as unknown as Types.ObjectId;
    await ChatService.restoreDeletedChat(chatId, participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat restored successfully!!",
      data: null,
    });
  });
  clearChat = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.chatId as unknown as Types.ObjectId;
    const participantId = req.params
      ?.participantId as unknown as Types.ObjectId;
    await ChatService.clearChat(chatId, participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat cleared successfully!!",
      data: null,
    });
  });
  restoreClearChat = this.catchAsync(async (req: Request, res: Response) => {
    const chatId = req.params?.chatId as unknown as Types.ObjectId;
    const participantId = req.params
      ?.participantId as unknown as Types.ObjectId;
    await ChatService.restoreClearChat(chatId, participantId);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat restored successfully!!",
      data: null,
    });
  });
}

export const ChatController = new Controller();
