import BackNavigationButton from "@/components/shared/BackNavigationButton";
import { useGetSingleChatQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { Box, Popover } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import DeleteChatButton from "../../chatList/DeleteChatButton";
import ClearChatButton from "../../chatList/ClearChatButton";
import RestoreClearChatButton from "../../chatList/RestoreClearChatButton";
import { AudioCall, VideoCall } from "@/components/calls";

const P2PActions = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { query } = useRouter();
  const chatId = query?.chatId as string;
  const { data } = useGetSingleChatQuery(chatId);
  const chat = data?.data as IGetChat;

  const handleOpen = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
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
        <Box component={"div"} className="flex flex-col gap-2 w-full">
          <Box component={"div"} className="block lg:hidden">
            <Box component={"div"} className="flex justify-between gap-1 mb-2">
              <AudioCall />
              <VideoCall />
            </Box>
            <BackNavigationButton />
          </Box>
          <ClearChatButton
            chat={chat}
            options={{ closeDropdown: handleClose }}
          />
          <RestoreClearChatButton
            chat={chat}
            options={{ closeDropdown: handleClose }}
          />
          <DeleteChatButton
            chat={chat}
            options={{ closeDropdown: handleClose }}
          />
        </Box>
      </Popover>
    </>
  );
};

export default P2PActions;
