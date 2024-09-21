import { Types } from "mongoose";
import { IGetMessage, IMessage } from "../interfaces/message.interface";
import { Message } from "../models/message.model";
import { ChatService } from "./chat.service";
import { UserService } from "./user.service";

class Service {
  public messageSanitizer(message: any): IGetMessage {
    const sender = UserService.userSanitizer(message?.sender);
    return {
      id: String(message?._id || message?.id),
      chatId: message?.chatId,
      sender: sender,
      content: message?.content,
      status: message?.status,
      media: message?.media,
      createdAt: message?.createdAt,
      updatedAt: message?.updatedAt,
    };
  }
  async sendMessage(receiver: Types.ObjectId, data: IMessage): Promise<void> {
    if (data?.chatId) {
      const result = await Message.create(data);
      const newMessage = await result.populate("sender");
      const message = this.messageSanitizer(newMessage);
      console.log(`Emit message: ${message}`);
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
      console.log(`Emit message: ${message}`);
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
