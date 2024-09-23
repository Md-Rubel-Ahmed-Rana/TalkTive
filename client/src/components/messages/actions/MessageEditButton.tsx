import { IGetMessage } from "@/interfaces/message.interface";
import EditIcon from "@mui/icons-material/Edit";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DangerousIcon from "@mui/icons-material/Dangerous";
import SmallLoaderSpinner from "@/components/shared/SmallLoaderSpinner";
import { useEditMessageMutation } from "@/features/message";
import toast from "react-hot-toast";

type Props = {
  message: IGetMessage;
};

const MessageEditButton = ({ message }: Props) => {
  const [open, setOpen] = useState(false);
  const [editMessage, { isLoading }] = useEditMessageMutation();
  const [newContent, setNewContent] = useState(message?.content);

  const handleEditMessage = async () => {
    try {
      const result: any = await editMessage({
        id: message.id,
        content: newContent,
      });
      if (result?.data?.statusCode === 200) {
        toast.success(result?.data?.message || "Your message updated!");
        setOpen(false);
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to update message. Try again!"
        );
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update message. Try again!");
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-500 cursor-pointer hover:bg-blue-600 rounded-md hover:text-white p-1"
      >
        <EditIcon titleAccess="Edit message content" />
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
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-md bg-white shadow-lg p-4">
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Edit message
            </Typography>
            <div className="my-4">
              <TextField
                id="edit-message"
                multiline
                defaultValue={message?.content}
                maxRows={4}
                fullWidth
                onChange={(e) => setNewContent(e.target?.value)}
              />
            </div>
            <div className="flex justify-between items-center mt-5">
              <Button
                disabled={isLoading}
                onClick={() => setOpen(false)}
                variant={isLoading ? "text" : "outlined"}
              >
                {isLoading ? <DangerousIcon /> : "Cancel"}
              </Button>
              {message?.content === newContent || !newContent ? (
                <Button variant="contained" className="bg-gray-600" disabled>
                  Make change
                </Button>
              ) : (
                <Button
                  onClick={handleEditMessage}
                  variant="contained"
                  disabled={isLoading}
                  className={`${isLoading ? "bg-gray-600" : "bg-blue-600"}`}
                >
                  {isLoading ? <SmallLoaderSpinner /> : "Save changes"}
                </Button>
              )}
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default MessageEditButton;
