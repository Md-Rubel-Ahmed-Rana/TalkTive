import { IUser } from "./user.interface";

export interface IMessage {
  poster: IUser;
  id?: string;
  text?: string;
  images?: string[];
  files?: string[];
  createdAt: Date;
  updatedAt: Date;
}
