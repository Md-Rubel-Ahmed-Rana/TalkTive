import { Types } from "mongoose";
import { IGetUser } from "./user.interface";

export type IMessage = {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  content?: string;
  media?: {
    type: "image" | "audio" | "video" | "document";
    url: string;
  }[];
  status: "sent" | "delivered" | "read";
};

type IMedia = {
  type: string;
  url: string;
};

export type IGetMessage = {
  id: string;
  chatId: string;
  sender: IGetUser;
  content: string;
  media: IMedia[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
