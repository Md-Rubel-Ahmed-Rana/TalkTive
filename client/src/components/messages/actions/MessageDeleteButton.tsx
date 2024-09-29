import { IGetMessage } from "@/interfaces/message.interface";
import DeleteIcon from "@mui/icons-material/Delete";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useDeleteMessageMutation } from "@/features/message";
import SmallLoaderSpinner from "@/components/shared/SmallLoaderSpinner";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { SocketContext } from "@/context/SocketContext";

type Props = {
  message: IGetMessage;
};
const MessageDeleteButton = ({ message }: Props) => {
  const { socket } = useContext(SocketContext);
  const [open, setOpen] = useState(false);
  const [deleteMessage, { isLoading }] = useDeleteMessageMutation();

  const handleDeleteMessage = async () => {
    try {
      const result: any = await deleteMessage(message?.id);
      console.log(result?.data?.data);
      if (result?.data?.statusCode === 200) {
        toast.success(result?.data?.message || "Your message deleted!");
        setOpen(false);
        socket.emit("deleted-message", result?.data?.data);
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to delete message. Try again!"
        );
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete message. Try again!");
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-500 cursor-pointer hover:bg-red-600 rounded-md hover:text-white p-1"
      >
        <DeleteIcon titleAccess="Delete message" />
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 rounded-md bg-white shadow-lg p-4">
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Are you sure?
            </Typography>
            <div className="flex justify-between items-center mt-5">
              <Button
                disabled={isLoading}
                onClick={() => setOpen(false)}
                variant={isLoading ? "text" : "outlined"}
              >
                {isLoading ? <DangerousIcon /> : "No"}
              </Button>
              <Button
                onClick={handleDeleteMessage}
                variant="contained"
                disabled={isLoading}
                className={`${isLoading ? "bg-gray-600" : "bg-blue-600"}`}
              >
                {isLoading ? <SmallLoaderSpinner /> : "Yes"}
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default MessageDeleteButton;
