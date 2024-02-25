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
  return result;
};

const getMessages = async (
  sender: string,
  receiver: string
): Promise<IMessage[]> => {
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

export const MessageService = { sendMessage, getMessages, getAllMessages };

const messages = [
  {
    _id: "65db71841e4c3ef3188b9718",
    sender: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    receiver: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    images: [],
    files: [],
    createdAt: "2024-02-25T16:57:40.217Z",
    updatedAt: "2024-02-25T16:57:40.217Z",
    id: "65db71841e4c3ef3188b9718",
  },
  {
    _id: "65db73fa1fd9d1c9554218a0",
    sender: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    receiver: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    content: "",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:08:10.776Z",
    updatedAt: "2024-02-25T17:08:10.776Z",
    id: "65db73fa1fd9d1c9554218a0",
  },
  {
    _id: "65db74ae1fd9d1c9554218b5",
    sender: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    receiver: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    content: "Hello",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:11:10.727Z",
    updatedAt: "2024-02-25T17:11:10.727Z",
    id: "65db74ae1fd9d1c9554218b5",
  },
  {
    _id: "65db7514d17e736820160af0",
    sender: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    receiver: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    content: "Hi",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:12:52.340Z",
    updatedAt: "2024-02-25T17:12:52.340Z",
    id: "65db7514d17e736820160af0",
  },
  {
    _id: "65db7540a3aea240004e088d",
    sender: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    receiver: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    content: "Test",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:13:36.700Z",
    updatedAt: "2024-02-25T17:13:36.700Z",
    id: "65db7540a3aea240004e088d",
  },
  {
    _id: "65db76d2a3aea240004e08b2",
    sender: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    receiver: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    content: "Hello Bodrul",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:20:18.268Z",
    updatedAt: "2024-02-25T17:20:18.268Z",
    id: "65db76d2a3aea240004e08b2",
  },
  {
    _id: "65db76dca3aea240004e08b9",
    sender: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    receiver: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    content: "",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:20:28.550Z",
    updatedAt: "2024-02-25T17:20:28.550Z",
    id: "65db76dca3aea240004e08b9",
  },
  {
    _id: "65db76eea3aea240004e08c0",
    sender: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    receiver: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    content: "",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:20:46.183Z",
    updatedAt: "2024-02-25T17:20:46.183Z",
    id: "65db76eea3aea240004e08c0",
  },
  {
    _id: "65db7716a3aea240004e08c7",
    sender: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    receiver: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    content: "Assalamu alaikum",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:21:26.851Z",
    updatedAt: "2024-02-25T17:21:26.851Z",
    id: "65db7716a3aea240004e08c7",
  },
  {
    _id: "65db7722a3aea240004e08ce",
    sender: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    receiver: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    content: "Walaikumus salam",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:21:38.450Z",
    updatedAt: "2024-02-25T17:21:38.450Z",
    id: "65db7722a3aea240004e08ce",
  },
  {
    _id: "65db7730a3aea240004e08d6",
    sender: {
      _id: "65da3d3cbfea455bf3f68a96",
      name: "Bodrul Amin",
      image: "https://i.ibb.co/dpsQ4rJ/bodrul.png",
      id: "65da3d3cbfea455bf3f68a96",
    },
    receiver: {
      _id: "65d8cdd048a7e7ae1ff0c7ff",
      name: "Rubel",
      image: "image.com",
      id: "65d8cdd048a7e7ae1ff0c7ff",
    },
    content: "Hello",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:21:52.217Z",
    updatedAt: "2024-02-25T17:21:52.217Z",
    id: "65db7730a3aea240004e08d6",
  },
  {
    _id: "65db7c198abdf0972b1227d1",
    sender: {
      _id: "65d9c7b2ee505bcb069e7be8",
      name: "Md Rubel Ahmed Rana",
      image: "https://i.ibb.co/LR6Xc0n/ahad.jpg",
      id: "65d9c7b2ee505bcb069e7be8",
    },
    receiver: {
      _id: "65d8cdd048a7e7ae1ff0c7ff",
      name: "Rubel",
      image: "image.com",
      id: "65d8cdd048a7e7ae1ff0c7ff",
    },
    content: "Hi Mohin",
    images: [],
    files: [],
    createdAt: "2024-02-25T17:42:49.713Z",
    updatedAt: "2024-02-25T17:42:49.713Z",
    id: "65db7c198abdf0972b1227d1",
  },
];
