import { Types } from "mongoose";
import {
  IGetMedia,
  IGetMessage,
  IMessage,
} from "../interfaces/message.interface";
import { Message } from "../models/message.model";
import { ChatService } from "./chat.service";
import { UserService } from "./user.service";
import ApiError from "../utils/apiError";
import httpStatus from "http-status";
import extractCloudinaryPublicId from "../utils/getCloudinaryFilePublicIdFromUrl";
import { deleteMultipleFileFromCloudinary } from "../utils/deletePreviousFileFromCloudinary";

class Service {
  private mediaSanitizer(media: any): IGetMedia {
    return {
      id: media?._id && String(media?._id || media?.id),
      type: media?.type,
      url: media?.url,
    };
  }
  public messageSanitizer(message: any): IGetMessage {
    const sender = UserService.userSanitizer(message?.sender);
    const media = message?.media?.map((mda: any) => this.mediaSanitizer(mda));
    return {
      id: message?._id && String(message?._id || message?.id),
      chatId: message?.chatId,
      sender: sender,
      content: message?.content,
      status: message?.status,
      media: media,
      createdAt: message?.createdAt,
      updatedAt: message?.updatedAt,
    };
  }
  async sendMessage(
    receiver: Types.ObjectId,
    data: IMessage
  ): Promise<IGetMessage> {
    if (data?.chatId) {
      const result = await Message.create(data);
      const newMessage = await result.populate("sender");
      const message = this.messageSanitizer(newMessage);
      if (receiver?.toString() !== "undefined") {
        await ChatService.reAddChatListOnNewMessageOneToOne(
          data?.chatId,
          receiver
        );
      }

      return message;
    } else {
      const chat = await ChatService.addNewChat({
        isGroupChat: false,
        participants: [receiver, data?.sender],
      });
      const result = await Message.create({
        ...data,
        chatId: chat?._id || chat?.id,
      });
      const newMessage = await result.populate("sender");
      const message = this.messageSanitizer(newMessage);
      return message;
    }
  }
  async getMessagesByChatId(
    chatId: Types.ObjectId,
    participantId: Types.ObjectId
  ): Promise<IGetMessage[]> {
    const data = await Message.find({
      chatId: chatId,
      clearedBy: { $ne: participantId },
    }).populate("sender");
    const messages = data?.map((msg) => this.messageSanitizer(msg));
    return messages;
  }
  async getUnreadMessageCount(
    chatId: Types.ObjectId,
    participantId: Types.ObjectId
  ): Promise<number> {
    const unreadCount = await Message.find({
      chatId: chatId,
      readBy: { $ne: participantId },
    }).countDocuments();
    return unreadCount;
  }
  async updateMessage(
    id: Types.ObjectId,
    updatedContent: string
  ): Promise<IGetMessage> {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { $set: { content: updatedContent } },
      { new: true }
    ).populate("sender");

    const message = this.messageSanitizer(updatedMessage);
    return message;
  }
  async readMessages(chatId: Types.ObjectId, participantId: Types.ObjectId) {
    await Message.updateMany(
      {
        chatId: chatId,
        readBy: { $nin: participantId },
      },
      {
        $push: { readBy: participantId },
      }
    );
  }
  async clearChat(chatId: Types.ObjectId, participantId: Types.ObjectId) {
    await Message.updateMany(
      { chatId: chatId },
      { $push: { clearedBy: participantId } }
    );
  }
  async restoreClearChatMessages(
    chatId: Types.ObjectId,
    participantId: Types.ObjectId
  ): Promise<Types.ObjectId> {
    await Message.updateMany(
      { chatId: chatId },
      { $pull: { clearedBy: participantId } }
    );
    const lastMessage = await Message.find({ chatId: chatId })
      .sort({
        createdAt: -1,
      })
      .limit(1);
    return lastMessage[0]?._id;
  }
  async deleteMessage(id: Types.ObjectId): Promise<Types.ObjectId> {
    const data = await Message.findById(id);
    const message = this.messageSanitizer(data);
    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, "Message was not found");
    } else {
      const chat = await ChatService.getSingleChat(
        new Types.ObjectId(message?.chatId)
      );
      if (chat?.lastMessage?.id === String(id)) {
        const lastMessage = await Message.find({ chatId: chat?.id })
          .sort({ createdAt: -1 })
          .limit(2);
        await ChatService.updateLastMessageId(
          chat?.id,
          lastMessage?.length > 0 ? lastMessage[1]?._id : null
        );
      }
      await Message.findByIdAndDelete(id);
      if (message?.media && message?.media?.length > 0) {
        await this.deleteMediaFromAMessage(message);
      }
    }
    return id;
  }
  async deleteMessagesByChatId(chatId: Types.ObjectId) {
    const messages = await Message.find({ chatId: chatId });

    const public_ids: { public_id: string }[] = [];

    messages?.forEach((message) => {
      if (message?.media && message?.media?.length > 0) {
        message?.media?.forEach((media) => {
          const publicId = extractCloudinaryPublicId(media?.url);
          if (publicId) {
            public_ids.push({ public_id: publicId });
          }
        });
      }
    });

    if (public_ids?.length > 0) {
      await deleteMultipleFileFromCloudinary(public_ids);
    }

    // Finally, delete all messages by chatId
    await Message.deleteMany({ chatId: chatId });
  }
  async deleteMediaFromAMessage(message: IGetMessage) {
    // delete media from cloudinary
    const urls = message?.media?.map((media) => media?.url);
    const public_ids: { public_id: string }[] = [];
    urls.forEach((url) => {
      const publicId = extractCloudinaryPublicId(url);
      if (publicId) {
        public_ids.push({ public_id: publicId });
      }
    });
    await deleteMultipleFileFromCloudinary(public_ids);
  }
}

export const MessageService = new Service();
