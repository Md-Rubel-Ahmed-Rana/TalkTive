import useGetLoggedInUser from "@/hooks/useGetLoggedInUser";
import { IMessage } from "@/interfaces/message.interface";
import { IUser } from "@/interfaces/user.interface";
import IncomingVideoCall from "@/pages/calls/IncomingVideoCall";
import { ReactNode, createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

const SocketProvider = ({ children }: Props) => {
  const socketIo: any = io;
  const socket = socketIo.connect("http://localhost:5050");
  const [realTimeMessages, setRealTimeMessages] = useState<IMessage[]>([]);
  const user: IUser = useGetLoggedInUser();
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

  useEffect(() => {
    socket.on("callUser", (data: any) => {
      user?.id === data?.to && setIsVideoCalling(true);
      setCaller(data.from);
    });
  }, [socket, user?.id]);

  // connect to socket message room
  useEffect(() => {
    socket.emit("message-room", user?.id);
  }, [socket, user?.id]);

  return (
    <>
      <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
      {isVideoCalling && (
        <IncomingVideoCall
          isVideoCalling={isVideoCalling}
          setIsVideoCalling={setIsVideoCalling}
          caller={caller}
        />
      )}
    </>
  );
};

export default SocketProvider;
