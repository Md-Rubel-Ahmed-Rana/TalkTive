import useGetLoggedInUser from "@/hooks/useGetLoggedInUser";
import { IContext } from "@/interfaces/context.interface";
import { IMessage } from "@/interfaces/message.interface";
import { IUser } from "@/interfaces/user.interface";
import VideoCall from "@/pages/calls/VideoCall";
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
  const socket = socketIo.connect("http://localhost:5050");
  const [realTimeMessages, setRealTimeMessages] = useState<IMessage[]>([]);
  const user: IUser = useGetLoggedInUser();
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const [caller, setCaller] = useState<any>({});

  // connect to socket message room
  useEffect(() => {
    socket.emit("message-room", user?.id);
  }, [socket, user?.id]);

  const values: IContext = {
    socket,
    realTimeMessages,
    setRealTimeMessages,
  };

  useEffect(() => {
    socket.on("videoCall", (data: any) => {
      user?.id === data?.to && setIsVideoCalling(true);
      setCaller(data.from);
    });
  }, [socket, user?.id]);

  return (
    <>
      <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
      {isVideoCalling && (
        <VideoCall
          isVideoCalling={isVideoCalling}
          setIsVideoCalling={setIsVideoCalling}
          caller={caller}
        />
      )}
    </>
  );
};

export default SocketProvider;
