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
