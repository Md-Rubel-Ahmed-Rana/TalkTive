/* eslint-disable react/no-children-prop */
import { useGetLoggedInUserQuery } from "@/features/auth";
import { useClearChatMutation } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import ServerActionLoadingModal from "../shared/ServerActionLoadingModal";

type Props = {
  chat: IGetChat;
  options?: Record<string, any>;
};

const ClearChatButton = ({ chat, options }: Props) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const [clearChat, { isLoading }] = useClearChatMutation();

  const handleDeleteChat = async () => {
    if (options && options?.closeDropdown) {
      options.closeDropdown();
    }
    handleCloseConfirmDialog();
    const failedMessage = "Failed to clear chat. Try again!";
    try {
      const result: any = await clearChat({
        chatId: chat?.id,
        participantId: user?.id,
      });
      if (result.data.statusCode === 200) {
        toast.success(result?.data?.message || "Chat cleared successfully!");
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
          "Clear chat"
        )}
      </Button>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-clear-chat"
      >
        <DialogTitle id="confirm-clear-chat">
          Are you sure to clear chat?
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
      {isLoading && (
        <ServerActionLoadingModal
          open={isLoading}
          actionText="Clearing your chat/messages"
        />
      )}
    </>
  );
};

export default ClearChatButton;
