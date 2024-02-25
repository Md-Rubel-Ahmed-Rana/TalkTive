import { IUser } from "./user.interface";

export interface IMessage {
  sender: IUser;
  receiver: IUser;
  id?: string;
  content?: string;
  images?: string[];
  files?: string[];
  createdAt: Date;
  updatedAt: Date;
}
