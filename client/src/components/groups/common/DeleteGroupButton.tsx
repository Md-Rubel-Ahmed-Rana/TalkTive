import { useGetLoggedInUserQuery } from "@/features/auth";
import { useDeleteGroupMutation } from "@/features/chat";
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
  btnText: string;
  groupId: string;
};

const DeleteGroupButton = ({ btnText, groupId }: Props) => {
  const [deleteGroup, { isLoading }] = useDeleteGroupMutation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery({});
  const router = useRouter();
  const user = userData?.data as IGetUser;
  const inboxLink = `/inbox/${user?.id}?userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleDeleteGroup = async () => {
    handleCloseConfirmDialog();
    try {
      const result: any = await deleteGroup(groupId);
      if (result?.data?.statusCode === 200) {
        toast.success(result?.data?.message || "Group deleted successfully!");
        router.push(inboxLink);
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to delete group. Try again!"
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete group");
    }
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
          btnText || "Delete group"
        )}
      </Button>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-clear-chat"
      >
        <DialogTitle id="confirm-clear-chat">
          Are you sure to delete group?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteGroup} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteGroupButton;
