import { IGetUser } from "./user.interface";

export type IMessage = {
  chatId: string;
  sender: string;
  content?: string;
  media?: {
    type: "image" | "audio" | "video" | "document";
    url: string;
  }[];
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
