import useGetLoggedInUser from "@/hooks/useGetLoggedInUser";
import { IContext } from "@/interfaces/context.interface";
import { IMessage } from "@/interfaces/message.interface";
import { IUser } from "@/interfaces/user.interface";
import IncomingVideoCall from "@/pages/calls/IncomingVideoCall";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer from "simple-peer";

// const initValues: IContext = {
//   socket: io("http://localhost:5050") as Socket,
//   realTimeMessages: [],
//   setRealTimeMessages: (messages: IMessage[]) => {},
// };

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
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [isCalled, setIsCalled] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef<any>(null);
  const userVideo = useRef<any>(null);
  const connectionRef = useRef<any>(null);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const values = {
    socket,
    realTimeMessages,
    setRealTimeMessages,
    isVideoCalling,
    setIsVideoCalling,
    caller,
    setCaller,
    callerSignal,
    setCallerSignal,
    callAccepted,
    setCallAccepted,
    connectionRef,
    isCalled,
    setIsCalled,
    me,
    setMe,
    receivingCall,
    setReceivingCall,
    idToCall,
    setIdToCall,
    callEnded,
    setCallEnded,
    name,
    setName,
    setStream,
    myVideo,
  };

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
          handleAcceptVideoCall={answerCall}
        />
      )}
    </>
  );
};

export default SocketProvider;
