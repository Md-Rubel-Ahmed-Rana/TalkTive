import { baseApi } from "@/features/api";
import { IGetMessage } from "@/interfaces/message.interface";
import { IGetUser } from "@/interfaces/user.interface";
import { ReactNode, createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { IncomingVideoCall } from "@/components/calls/video/one-to-one";
import { IncomingAudioCall } from "@/components/calls/audio/one-to-one";

export const SocketContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

const SocketProvider = ({ children }: Props) => {
  const socketIo: any = io;
  const socket = socketIo.connect(baseApi) as Socket;
  const [realTimeMessages, setRealTimeMessages] = useState<IGetMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<IGetUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [isP2PAudioCalling, setIsP2PAudioCalling] = useState(false);
  const [callerInfo, setCallerInfo] = useState<any>({});
  const [p2pAudioCallerInfo, setP2pAudioCallerInfo] = useState<any>({});

  useEffect(() => {
    if (currentUser && currentUser?.id) {
      socket.emit("join-room", currentUser.id);

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        setIsDialogOpen(true);
        return (e.returnValue = "Are you sure you want to leave?");
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        socket.emit("user-disconnect", currentUser?.id);
        socket.disconnect();
      };
    }
  }, [currentUser, socket]);

  const handleConfirmLeave = () => {
    socket.emit("user-disconnect", currentUser?.id);
    setIsDialogOpen(false);
  };

  const handleCancelLeave = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    socket?.on(
      "receive-video-call",
      (data: {
        sender: { id: string; name: string; image: string };
        receiver: string;
        videoOffer: any;
      }) => {
        console.log("Got a video call", data);
        setIsIncomingCall(true);
        setCallerInfo(data?.sender);
      }
    );
    socket?.on(
      "incoming-p2p-audio-call",
      (data: {
        sender: { id: string; name: string; image: string };
        receiver: string;
      }) => {
        console.log("Got an audio call", data);
        setIsP2PAudioCalling(true);
        setP2pAudioCallerInfo(data?.sender);
      }
    );

    return () => {
      socket?.off("receive-video-call");
      socket?.off("incoming-p2p-audio-call");
    };
  }, [socket]);

  const values = {
    socket,
    realTimeMessages,
    setRealTimeMessages,
    currentUser,
    setCurrentUser,
  };

  return (
    <SocketContext.Provider value={values}>
      {children}
      <Dialog open={isDialogOpen} onClose={handleCancelLeave}>
        <DialogTitle>Confirm Disconnect</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to disconnect from the chat? You will be
            logged out and your session will end.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLeave} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLeave} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <IncomingVideoCall
        callerInfo={callerInfo}
        isIncomingCall={isIncomingCall}
        setIsIncomingCall={setIsIncomingCall}
        currentUser={currentUser as IGetUser}
      />
      <IncomingAudioCall
        isCalling={isP2PAudioCalling}
        setIsCalling={setIsP2PAudioCalling}
        sender={p2pAudioCallerInfo}
        currentUser={currentUser as IGetUser}
      />
    </SocketContext.Provider>
  );
};

export default SocketProvider;
