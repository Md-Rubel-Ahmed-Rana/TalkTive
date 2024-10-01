import { SocketContext } from "@/context/SocketContext";
import { IGetUser } from "@/interfaces/user.interface";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  callerInfo: { id: string; name: string; image: string };
  isIncomingCall: boolean;
  currentUser: IGetUser;
  setIsIncomingCall: (value: boolean) => void;
};

const IncomingVideoCall = ({
  isIncomingCall,
  setIsIncomingCall,
  callerInfo,
  currentUser,
}: Props) => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();

  const handleCloseModal = () => {
    setIsIncomingCall(false);
  };

  const handleDeclineCall = () => {
    setIsIncomingCall(false);
    socket.emit("decline-video-call", {
      sender: {
        id: currentUser?.id,
        name: currentUser?.name,
        image: currentUser?.image,
      },
      receiver: callerInfo?.id,
    });
  };

  const handleReceiveCall = async () => {
    setIsIncomingCall(false);
    socket.emit("video-call-accepted", {
      sender: {
        id: currentUser?.id,
        name: currentUser?.name,
        image: currentUser?.image,
      },
      receiver: callerInfo?.id,
    });
    router.push(
      `/call/video/${callerInfo?.id}?sender=${callerInfo?.id}&receiver=${currentUser?.id}`
    );
    toast.success("You have accepted video call!");
  };

  useEffect(() => {
    socket.on("cancel-video-call", () => {
      setIsIncomingCall(false);
      toast.success(`${callerInfo?.name} has cancelled the call!`);
    });

    return () => {
      socket.off("cancel-video-call");
    };
  }, [callerInfo?.name, setIsIncomingCall, socket]);

  return (
    <Modal
      open={isIncomingCall}
      onClose={handleCloseModal}
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
          {callerInfo?.name} is calling...
        </Typography>
        <Box className="flex flex-col justify-center items-center w-full my-5">
          <Avatar
            src={callerInfo?.image}
            className="h-24 w-24 ring-2 rounded-full"
          />
          <Typography
            className="text-center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Video call
          </Typography>
        </Box>
        <Box className="flex justify-between w-full gap-5 mt-5">
          <Button
            onClick={handleDeclineCall}
            variant="outlined"
            className="w-full bg-red-500 text-white"
          >
            Decline
          </Button>
          <Button
            onClick={handleReceiveCall}
            variant="outlined"
            className="w-full bg-blue-600 text-white"
          >
            Receive
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default IncomingVideoCall;
