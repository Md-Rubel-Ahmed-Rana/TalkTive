import { IMessage } from "@/interfaces/message.interface";
import { ReactNode, createContext, useState } from "react";
import io, { Socket } from "socket.io-client";

export const SocketContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

const SocketProvider = ({ children }: Props) => {
  const socketIo: any = io;
  const socket = socketIo.connect("http://localhost:5050") as Socket;
  const [realTimeMessages, setRealTimeMessages] = useState<IMessage[]>([]);
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const [caller, setCaller] = useState({});
  const [selectedUser, setSelectedUser] = useState({});

  const values = {
    socket,
    realTimeMessages,
    setRealTimeMessages,
    isVideoCalling,
    setIsVideoCalling,
    caller,
    setCaller,
    selectedUser,
    setSelectedUser,
  };

  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
