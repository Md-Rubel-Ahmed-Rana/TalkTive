import { AudioCall, VideoCall } from "@/components/calls";
import BackNavigationButton from "@/components/shared/BackNavigationButton";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import {
  Button,
  Popover,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

const GroupActions = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { query } = useRouter();
  const chatId = query.chatId as string;

  const handleOpen = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    handleClose();
  };

  const handleClearChat = () => {
    console.log(`Clearing chat for group: ${chatId}`);
    handleCloseConfirmDialog();
    toast.success("Feature unavailable. Stay with to get the feature.");
    handleClose();
  };

  const handleLeaveGroup = () => {
    console.log(`Leaving group: ${chatId}`);
    toast.success("Feature unavailable. Stay with to get the feature.");
    handleClose();
  };

  const handleDeleteGroup = () => {
    console.log(`Deleting group: ${chatId}`);
    toast.success("Feature unavailable. Stay with to get the feature.");
    handleClose();
  };
  const handleNavigateGroupDetails = () => {
    console.log(`Chat/Group Details: ${chatId}`);
    toast.success("Feature unavailable. Stay with to get the feature.");
    handleClose();
  };

  const handleAddMember = () => {
    console.log(`Chat: ${chatId}`);
    toast.success("Feature unavailable. Stay with to get the feature.");
    handleClose();
  };
  const handleRemoveMember = () => {
    console.log(`Chat: ${chatId}`);
    toast.success("Feature unavailable. Stay with to get the feature.");
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <MoreVertOutlinedIcon
        className="cursor-pointer"
        titleAccess="Chat actions"
        aria-describedby={chatId}
        onClick={handleOpen}
      />
      <Popover
        id={chatId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            padding: "16px",
            maxWidth: "300px",
            marginTop: "14px",
          },
        }}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="block lg:hidden">
            <div className="flex justify-between gap-1">
              <Button className="w-full" variant="outlined">
                <AudioCall />
              </Button>
              <Button className="w-full" variant="outlined">
                <VideoCall />
              </Button>
            </div>
            <BackNavigationButton />
          </div>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleNavigateGroupDetails}
          >
            Group Details
          </Button>
          <Button onClick={handleAddMember} variant="outlined" fullWidth>
            Add member
          </Button>
          <Button onClick={handleRemoveMember} variant="outlined" fullWidth>
            Remove member
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleOpenConfirmDialog}
          >
            Clear chat
          </Button>
          <Button variant="outlined" fullWidth onClick={handleLeaveGroup}>
            Leave group
          </Button>
          <Button variant="outlined" fullWidth onClick={handleDeleteGroup}>
            Delete
          </Button>
        </div>
      </Popover>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-clear-chat"
      >
        <DialogTitle id="confirm-clear-chat">
          Are you sure you want to clear the chat?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClearChat} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupActions;
