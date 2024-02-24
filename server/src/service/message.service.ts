import { IMessage } from "../interfaces/message.interface";
import { Message } from "../models/message.model";

const sendMessage = async (data: IMessage): Promise<IMessage> => {
  const result = await Message.create(data);
  return result;
};

export const MessageService = { sendMessage };
