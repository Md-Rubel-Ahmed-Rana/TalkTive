import { Types } from "mongoose";
import { IUser } from "./user.interface";

export type IMessage = {
  poster: Types.ObjectId | IUser;
  conversationId: string;
  type: string;
  text?: string;
  images?: string[];
  files?: string[];
};
