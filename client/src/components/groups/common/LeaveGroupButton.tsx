import { useGetLoggedInUserQuery } from "@/features/auth";
import { useRemoveMemberMutation } from "@/features/chat";
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
  chatId: string;
};

const LeaveGroupButton = ({ chatId }: Props) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery({});
  const router = useRouter();
  const user = userData?.data as IGetUser;
  const [leaveGroup, { isLoading }] = useRemoveMemberMutation();
  const inboxLink = `/inbox/${user?.id}?userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;

  const handleLeaveGroup = async () => {
    try {
      const result: any = await leaveGroup({ chatId, participantId: user?.id });
      if (result?.data?.statusCode === 200) {
        toast.success(
          result?.data?.message || "Group member removed successfully!"
        );
        router.push(inboxLink);
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to remove member"
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove member. Try again!");
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
        variant="outlined"
        fullWidth
        onClick={handleOpenConfirmDialog}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Leave group"
        )}
      </Button>
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-clear-chat"
      >
        <DialogTitle id="confirm-clear-chat">
          Are you sure to leave group?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLeaveGroup} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeaveGroupButton;
