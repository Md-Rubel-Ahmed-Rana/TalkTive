import { Socket } from "socket.io-client";
import { IMessage } from "./message.interface";

export type IContext = {
  socket: Socket;
  realTimeMessages: IMessage[];
  setRealTimeMessages: (messages: IMessage[]) => void;
  handleAcceptVideoCall: (
    setCallAccepted: any,
    stream: any,
    userVideo: any,
    callerSignal: any,
    connectionRef: any
  ) => void;
};
