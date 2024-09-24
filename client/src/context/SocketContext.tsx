import { baseApi } from "@/features/api";
import { IGetMessage } from "@/interfaces/message.interface";
import { IGetUser } from "@/interfaces/user.interface";
import { ReactNode, createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export const SocketContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

const SocketProvider = ({ children }: Props) => {
  const socketIo: any = io;
  const socket = socketIo.connect(baseApi) as Socket;
  const [realTimeMessages, setRealTimeMessages] = useState<IGetMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<IGetUser | null>(null);

  // connect to user own room
  useEffect(() => {
    if (currentUser && currentUser?.id) {
      socket.emit("join-room", currentUser?.id);
    }
  }, [currentUser, socket]);

  const values = {
    socket,
    realTimeMessages,
    setRealTimeMessages,
    currentUser,
    setCurrentUser,
  };

  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
