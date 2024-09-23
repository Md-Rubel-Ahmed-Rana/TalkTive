import { IGetMedia } from "./message.interface";
import { IGetUser } from "./user.interface";

export type IChat = {
  isGroupChat: boolean;
  participants: string[];
  groupName?: string | null;
  groupImage?: string | null;
  admin?: string | null;
};

export type IGetLastMessage = {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  status: string;
  media: IGetMedia[];
  createdAt: Date;
  updatedAt: Date;
};

export type IGetChat = {
  id: string;
  isGroupChat: boolean;
  participants: IGetUser[];
  groupName: string;
  groupImage: string;
  admin: IGetUser;
  lastMessage: IGetLastMessage;
  createdAt: Date;
  updatedAt: Date;
};
