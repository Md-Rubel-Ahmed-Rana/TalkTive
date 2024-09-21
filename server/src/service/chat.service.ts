import { IChat, IGetChat, IGetLastMessage } from "../interfaces/chat.interface";
import { Chat } from "../models/chat.model";
import { sortChatsByLastMessage } from "../utils/chatSorter";
import { UserService } from "./user.service";

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
      id: String(chat?._id || chat?.id),
      isGroupChat: chat?.isGroupChat,
      groupName: chat?.groupName,
      groupImage: chat?.groupImage,
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

  async myChatList(participantId: string): Promise<IGetChat[]> {
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
}

export const ChatService = new Service();
