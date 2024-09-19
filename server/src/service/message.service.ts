import { IMessage } from "../interfaces/message.interface";
import { Message } from "../models/message.model";

const sendMessage = async (data: IMessage): Promise<IMessage> => {
  const result = await Message.create(data);
  await result.populate([
    {
      path: "sender",
      model: "User",
      select: {
        name: 1,
        image: 1,
      },
    },
    {
      path: "receiver",
      model: "User",
      select: {
        name: 1,
        image: 1,
      },
    },
  ]);
  global.io.emit("message", data);
  return result;
};

const getMessages = async (
  sender: string,
  receiver: string
): Promise<IMessage[]> => {
  console.log(sender, receiver);
  if (sender === undefined && receiver === undefined) {
    const result = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).populate([
      {
        path: "sender",
        model: "User",
        select: {
          name: 1,
          image: 1,
        },
      },
      {
        path: "receiver",
        model: "User",
        select: {
          name: 1,
          image: 1,
        },
      },
    ]);
    return result;
  } else {
    return [];
  }
};

const getLastMessage = async (): Promise<IMessage> => {
  const result = await Message.find({}).sort({ created: -1 });
  return result[0];
};

const getAllMessages = async (): Promise<IMessage[]> => {
  const result = await Message.find({}).populate([
    {
      path: "sender",
      model: "User",
      select: {
        name: 1,
        image: 1,
      },
    },
    {
      path: "receiver",
      model: "User",
      select: {
        name: 1,
        image: 1,
      },
    },
  ]);
  return result;
};

export const MessageService = {
  sendMessage,
  getMessages,
  getAllMessages,
  getLastMessage,
};
