import { Types } from "mongoose";
import {
  IGetMedia,
  IGetMessage,
  IMessage,
} from "../interfaces/message.interface";
import { Message } from "../models/message.model";
import { ChatService } from "./chat.service";
import { UserService } from "./user.service";

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
  async getMessagesByChatId(chatId: Types.ObjectId): Promise<IGetMessage[]> {
    const data = await Message.find({ chatId: chatId }).populate("sender");
    const messages = data?.map((msg) => this.messageSanitizer(msg));
    return messages;
  }
  async updateMessage(id: Types.ObjectId, updatedContent: string) {
    await Message.findByIdAndUpdate(id, { $set: { content: updatedContent } });
  }
  async deleteMessage(id: Types.ObjectId) {
    await Message.findByIdAndDelete(id);
  }
}

export const MessageService = new Service();
