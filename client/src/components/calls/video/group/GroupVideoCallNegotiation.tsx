import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import toast from "react-hot-toast";
import VideoCamIcon from "@mui/icons-material/Videocam";
import { useState } from "react";
import { useRouter } from "next/router";
import { useGetSingleChatQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";

const GroupVideoCallNegotiation = () => {
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const { query } = useRouter();
  const chatId = query?.chatId as string;
  const { data } = useGetSingleChatQuery(chatId);
  const group = data?.data as IGetChat;

  const handleMakeVideoCall = () => {
    toast.success(
      "Group video call feature currently unavailable. It's coming very soon. Please wait and be patient!"
    );
    // setIsVideoCalling(true);
  };

  const handleCancelCall = () => {
    setIsVideoCalling(false);
  };

  return (
    <>
      <Button
        onClick={handleMakeVideoCall}
        className="w-full"
        variant="outlined"
      >
        <VideoCamIcon titleAccess="Make a video call" />
      </Button>
      <Modal
        open={isVideoCalling}
        onClose={handleCancelCall}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] lg:w-96 rounded-md bg-white shadow-lg p-4">
          <Typography
            className="text-center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {group?.groupName}
          </Typography>
          <Box className="flex justify-center flex-col items-center w-full my-5">
            <Avatar
              src={group?.groupImage}
              className="h-24 w-24 ring-2 mb-3 rounded-full"
            />
            <Button variant="outlined">Ringing</Button>
          </Box>
          <Box className="flex justify-center w-full gap-5 mt-5">
            <Button
              onClick={handleCancelCall}
              variant="outlined"
              className="w-full bg-blue-600 text-white"
            >
              Cancel call
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default GroupVideoCallNegotiation;
