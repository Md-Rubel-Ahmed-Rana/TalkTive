import { Types } from "mongoose";
import { IUser } from "./user.interface";

export type IMessage = {
  sender: Types.ObjectId | IUser;
  receiver: Types.ObjectId | IUser;
  content?: string;
  images?: string[];
  files?: string[];
};
