import useGetLoggedInUser from "@/hooks/useGetLoggedInUser";
import { IContext } from "@/interfaces/context.interface";
import { IMessage } from "@/interfaces/message.interface";
import { IUser } from "@/interfaces/user.interface";
import { ReactNode, createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const initValues: IContext = {
  socket: io("http://localhost:5050") as Socket,
  realTimeMessages: [],
  setRealTimeMessages: (messages: IMessage[]) => {},
};

export const SocketContext = createContext<IContext>(initValues);

type Props = {
  children: ReactNode;
};

const SocketProvider = ({ children }: Props) => {
  const socketIo: any = io;
  const socket = socketIo.connect("http://localhost:5000");
  const [realTimeMessages, setRealTimeMessages] = useState<IMessage[]>([]);
  const user: IUser = useGetLoggedInUser();

  // connect to socket notification room
  useEffect(() => {
    socket.emit("notification-room", user?.id);
  }, [socket, user?.id]);

  // connect to socket active
  useEffect(() => {
    socket.emit("active", user?.id);
  }, [socket, user?.id]);

  const values: IContext = {
    socket,
    realTimeMessages,
    setRealTimeMessages,
  };

  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
