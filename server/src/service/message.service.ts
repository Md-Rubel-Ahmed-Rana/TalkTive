import { IMessage } from "../interfaces/message.interface";
import { Message } from "../models/message.model";

const sendMessage = async (data: IMessage): Promise<IMessage> => {
  const result = await Message.create(data);
  return result;
};

const getMessages = async (conversationId: string): Promise<IMessage[]> => {
  const result = await Message.find({ conversationId }).populate({
    path: "poster",
    select: {
      name: 1,
      image: 1,
    },
  });
  return result;
};

export const MessageService = { sendMessage, getMessages };
