import { Types } from "mongoose";
import { IGetUser } from "./user.interface";

export type IChat = {
  isGroupChat: boolean;
  participants: Types.ObjectId[];
  deletedBy?: Types.ObjectId[];
  groupName?: string | null;
  groupImage?: string | null;
  groupDescription?: string | null;
  groupRules?: string[] | null;
  admin?: Types.ObjectId | null;
  lastMessage?: Types.ObjectId | null;
};

export type IGetLastMessage = {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  status: string;
  media: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type IGetChat = {
  id: string;
  isGroupChat: boolean;
  participants: IGetUser[];
  groupName: string;
  groupImage: string;
  groupRules: string[];
  groupDescription: string;
  admin: IGetUser;
  unreadMessage: number;
  lastMessage: IGetLastMessage;
  createdAt: Date;
  updatedAt: Date;
};
