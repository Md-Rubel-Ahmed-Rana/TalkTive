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

  const values = {
    socket,
    realTimeMessages,
    setRealTimeMessages,
    currentUser,
    setCurrentUser,
  };

  console.log("Hello, I am from Socket context");

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
    </SocketContext.Provider>
  );
};

export default SocketProvider;
