import { AudioCall, VideoCall } from "@/components/calls";
import BackNavigationButton from "@/components/shared/BackNavigationButton";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Popover,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

const P2PActions = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { query } = useRouter();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const chatId = query.chatId as string;

  const handleOpen = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
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

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleDeleteGroup = () => {
    console.log(`Deleting chat: ${chatId}`);
    toast.success("Feature unavailable. Stay with to get the feature.");
    handleClose();
  };

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
              <Button variant="outlined">
                <AudioCall />
              </Button>
              <Button variant="outlined">
                <VideoCall />
              </Button>
            </div>
            <BackNavigationButton />
          </div>
          <Button
            onClick={handleOpenConfirmDialog}
            variant="outlined"
            fullWidth
          >
            Clear chat
          </Button>
          <Button onClick={handleDeleteGroup} variant="outlined" fullWidth>
            Delete chat
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

export default P2PActions;
