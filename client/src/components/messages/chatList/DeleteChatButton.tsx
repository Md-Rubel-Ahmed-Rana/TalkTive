import { useGetLoggedInUserQuery } from "@/features/auth";
import { useDeleteChatMutation } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  chat: IGetChat;
};

const DeleteChatButton = ({ chat }: Props) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const [deleteChat, { isLoading }] = useDeleteChatMutation();
  const router = useRouter();
  const inboxLink = `/inbox/${user?.id}?userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;

  const handleDeleteChat = async () => {
    handleCloseConfirmDialog();
    const failedMessage = "Failed to delete chat. Try again!";
    try {
      const result: any = await deleteChat({
        chatId: chat?.id,
        participantId: user?.id,
      });
      if (result.data.statusCode === 200) {
        toast.success(result?.data?.message || "Chat deleted successfully!");
        router.push(inboxLink);
      } else {
        toast.success(
          result?.data?.message || result?.error?.data?.message || failedMessage
        );
      }
    } catch (error: any) {
      toast.error(error?.message || failedMessage);
    }
  };

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <>
      <Button
        disabled={isLoading}
        onClick={handleOpenConfirmDialog}
        variant="outlined"
        fullWidth
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Delete chat"
        )}
      </Button>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-clear-chat"
      >
        <DialogTitle id="confirm-clear-chat">
          Are you sure to delete chat?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteChat} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteChatButton;
