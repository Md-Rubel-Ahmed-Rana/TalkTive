import { useRemoveMemberMutation } from "@/features/chat";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  btnText?: string;
  chatId: string;
  memberId: string;
};

const RemoveMemberButton = ({ btnText, chatId, memberId }: Props) => {
  const [removeMember, { isLoading }] = useRemoveMemberMutation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleRemoveMember = async () => {
    handleCloseConfirmDialog();
    try {
      const result: any = await removeMember({
        chatId: chatId,
        participantId: memberId,
      });
      if (result?.data?.statusCode === 200) {
        toast.success(
          result?.data?.message || "Member has been removed successfully!"
        );
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to remove member. Try again!"
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove member");
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
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          btnText || "Remove member"
        )}
      </Button>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-clear-chat"
      >
        <DialogTitle id="confirm-clear-chat">
          Are you sure to remove member?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveMember} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RemoveMemberButton;
