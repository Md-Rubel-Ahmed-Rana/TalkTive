import { Request, Response } from "express";
import RootController from "./rootController";
import { ChatService } from "../service/chat.service";
import httpStatus from "http-status";
import { Types } from "mongoose";

class Controller extends RootController {
  addNewChat = this.catchAsync(async (req: Request, res: Response) => {
    console.log("Participants before processing:", req.body.participants);

    // Ensure participants is an array, even if it comes as a stringified array
    let participants = req.body.participants;

    if (typeof participants === "string") {
      try {
        participants = JSON.parse(participants); // Parse if it's a JSON string
      } catch (error) {
        throw new Error(
          "Participants field is not a valid array or JSON string."
        );
      }
    }

    if (Array.isArray(participants)) {
      req.body.participants = participants.map((user: string) => {
        if (Types.ObjectId.isValid(user)) {
          return new Types.ObjectId(user);
        } else {
          throw new Error(`Invalid ObjectId: ${user}`);
        }
      });
    } else {
      // If participants is not an array, throw an error
      throw new Error("Participants should be an array.");
    }

    console.log("Processed body:", req.body);

    await ChatService.addNewChat(req.body);
    this.apiResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Group created successfully",
      data: null,
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
}

export const ChatController = new Controller();
