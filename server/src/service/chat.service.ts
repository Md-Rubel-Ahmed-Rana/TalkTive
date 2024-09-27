import { Types } from "mongoose";
import { IChat, IGetChat, IGetLastMessage } from "../interfaces/chat.interface";
import { Chat } from "../models/chat.model";
import { sortChatsByLastMessage } from "../utils/chatSorter";
import { UserService } from "./user.service";
import ApiError from "../utils/apiError";
import httpStatus from "http-status";
import extractCloudinaryPublicId from "../utils/getCloudinaryFilePublicIdFromUrl";
import { deleteSingleFileFromCloudinary } from "../utils/deletePreviousFileFromCloudinary";

class Service {
  public lastMessageSanitizer(message: any): IGetLastMessage {
    return {
      id: message?._id && String(message?._id),
      chatId: message?.chatId,
      sender: message?.sender,
      content: message?.content,
      status: message?.status,
      media: message?.media,
      createdAt: message?.createdAt,
      updatedAt: message?.updatedAt,
    };
  }

  public chatSanitizer(chat: any): IGetChat {
    const participants = chat?.participants?.map((user: any) =>
      UserService.userSanitizer(user)
    );
    const admin = UserService.userSanitizer(chat?.admin);
    const lastMessage = this.lastMessageSanitizer(chat?.lastMessage);
    return {
      id: chat?._id && String(chat?._id || chat?.id),
      isGroupChat: chat?.isGroupChat,
      groupName: chat?.groupName,
      groupImage: chat?.groupImage,
      groupDescription: chat?.groupDescription,
      groupRules: chat?.groupRules,
      admin: admin,
      participants: participants,
      lastMessage: lastMessage,
      createdAt: chat?.createdAt,
      updatedAt: chat?.updatedAt,
    };
  }

  async addNewChat(data: IChat) {
    const newChat = await Chat.create(data);
    return newChat;
  }

  async myChatList(participantId: Types.ObjectId): Promise<IGetChat[]> {
    const chatList = await Chat.find({ participants: participantId }).populate([
      {
        path: "admin",
        model: "User",
      },
      {
        path: "participants",
        model: "User",
      },
      {
        path: "lastMessage",
        model: "Message",
      },
    ]);

    const chats = chatList.map((chat) => this.chatSanitizer(chat));
    const sortedChats = sortChatsByLastMessage(chats);
    return sortedChats;
  }

  async getSingleChat(chatId: Types.ObjectId): Promise<IGetChat> {
    const data = await Chat.findById(chatId).populate([
      {
        path: "admin",
        model: "User",
      },
      {
        path: "participants",
        model: "User",
      },
      {
        path: "lastMessage",
        model: "Message",
      },
    ]);
    const chat = this.chatSanitizer(data);
    return chat;
  }

  async getChatByTwoParticipants(
    participant1: Types.ObjectId,
    participant2: Types.ObjectId
  ): Promise<IGetChat> {
    const data = await Chat.findOne({
      participants: [participant1, participant2],
    }).populate([
      {
        path: "admin",
        model: "User",
      },
      {
        path: "participants",
        model: "User",
      },
      {
        path: "lastMessage",
        model: "Message",
      },
    ]);
    const chat = this.chatSanitizer(data);
    return chat;
  }

  async deleteChat(chatId: Types.ObjectId): Promise<void> {
    await Chat.findByIdAndDelete(chatId);
  }

  async updateChatInfo(
    chatId: Types.ObjectId,
    updatedChat: Partial<IChat>
  ): Promise<void> {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(httpStatus.NOT_FOUND, "Chat was not found!");
    } else {
      await Chat.findByIdAndUpdate(chatId, { $set: { ...updatedChat } });
    }
  }

  async changeGroupImage(chatId: Types.ObjectId, imageLink: string) {
    if (imageLink) {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        throw new ApiError(httpStatus.NOT_FOUND, "Chat was not found!");
      } else {
        if (chat?.groupImage) {
          const publicId = extractCloudinaryPublicId(chat?.groupImage);
          if (publicId) {
            await deleteSingleFileFromCloudinary(publicId);
          }
          await Chat.findByIdAndUpdate(chatId, {
            $set: { groupImage: imageLink },
          });
        }
      }
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Group image was not provided"
      );
    }
  }

  async addNewParticipant(
    chatId: Types.ObjectId,
    participantId: Types.ObjectId
  ): Promise<void> {
    await Chat.findByIdAndUpdate(chatId, {
      $push: { participants: participantId },
    });
  }

  async removeParticipant(
    chatId: Types.ObjectId,
    participantId: Types.ObjectId
  ): Promise<void> {
    await Chat.findByIdAndUpdate(chatId, {
      $pull: { participants: participantId },
    });
  }
}

export const ChatService = new Service();
