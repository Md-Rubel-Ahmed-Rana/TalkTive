import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { Box, Button, Popover, Typography } from "@mui/material";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRouter } from "next/router";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutButton from "../shared/LogoutButton";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeletedChatList from "./chatList/DeletedChatList";

const inboxActionId = "inbox-action-id";

const InboxActions = () => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const [showDeletedChats, setShowDeletedChats] = useState(false);
  const router = useRouter();
  const settingLink = `/user/settings/${user?.id}?userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;
  const groupCreateLink = `/new-group/create/${user?.id}?userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpen = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToHome = () => {
    router.push("/");
  };

  return (
    <>
      <Button
        variant="outlined"
        title="Inbox actions"
        aria-describedby={inboxActionId}
        onClick={handleOpen}
      >
        <MoreVertOutlinedIcon />
      </Button>
      <Popover
        id={inboxActionId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            padding: "16px",
            maxWidth: "300px",
            marginTop: "6px",
          },
        }}
      >
        <Box className="flex flex-col gap-2">
          <Button
            variant="outlined"
            onClick={handleNavigateToHome}
            className="flex items-center gap-2 w-full"
          >
            <HomeIcon className="cursor-pointer" />
            <Typography>Home</Typography>
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push(groupCreateLink)}
            className="flex items-center gap-2 w-full"
          >
            <GroupsIcon className="cursor-pointer" />
            <Typography>Create group</Typography>
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push(settingLink)}
            className="flex items-center gap-2 w-full"
          >
            <SettingsIcon className="cursor-pointer" />
            <Typography>Settings</Typography>
          </Button>
          <Button
            onClick={() => {
              setShowDeletedChats(true);
              handleClose();
            }}
            variant="outlined"
            className="flex items-center gap-2 w-full"
          >
            <ChatBubbleIcon className="cursor-pointer" />
            <Typography>Deleted chats</Typography>
          </Button>
          <LogoutButton />
        </Box>
      </Popover>
      <DeletedChatList open={showDeletedChats} setOpen={setShowDeletedChats} />
    </>
  );
};

export default InboxActions;
