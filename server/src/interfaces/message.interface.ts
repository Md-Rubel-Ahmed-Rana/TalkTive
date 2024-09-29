import { Types } from "mongoose";
import { IGetUser } from "./user.interface";

export type IMessage = {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  clearedBy?: Types.ObjectId[];
  readBy?: Types.ObjectId[];
  content?: string;
  media?: {
    type: "image" | "audio" | "video" | "document";
    url: string;
  }[];
  status: "sent" | "delivered" | "read";
};

export type IGetMedia = {
  id: string;
  type: string;
  url: string;
};

export type IGetMessage = {
  id: string;
  chatId: string;
  sender: IGetUser;
  content: string;
  media: IGetMedia[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
