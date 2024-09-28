import { IGetUser } from "@/interfaces/user.interface";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  currentUser: IGetUser | null;
  socket: Socket;
};

const ConfirmDisconnectDialog = ({ currentUser, socket }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmLeave = () => {
    socket.emit("user-disconnect", currentUser?.id);
    setIsDialogOpen(false);
  };

  const handleCancelLeave = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (currentUser && currentUser?.id) {
      socket.on("disconnect", (reason) => {
        console.log({ disconnect: reason });
      });

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        setIsDialogOpen(true);
        return (e.returnValue = "Are you sure you want to leave?");
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        socket.emit("user-disconnect", currentUser.id);
        socket.disconnect();
      };
    }
  }, [currentUser, socket]);

  return (
    <Dialog open={isDialogOpen} onClose={handleCancelLeave}>
      <DialogTitle>Confirm Disconnect</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to disconnect from the chat? You will be logged
          out and your session will end.
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
  );
};

export default ConfirmDisconnectDialog;
