import { IGetMedia } from "./message.interface";
import { IGetUser } from "./user.interface";

export type IChat = {
  isGroupChat: boolean;
  participants: string[];
  groupName: string;
  groupImage?: File | null;
  groupDescription?: string;
  groupRules?: string[];
  admin: string | null;
};

export type IEditGroup = {
  groupName: string;
  groupDescription: string;
  groupRules: string[];
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
  groupDescription: string;
  groupRules: string[];
  admin: IGetUser;
  lastMessage: IGetLastMessage;
  createdAt: Date;
  updatedAt: Date;
};
