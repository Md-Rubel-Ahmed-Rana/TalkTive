import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  isCalling: boolean;
  setIsCalling: (value: boolean) => void;
  sender: { id: string; name: string; image: string };
  currentUser: IGetUser;
};

const IncomingAudioCall = ({
  sender,
  isCalling,
  setIsCalling,
  currentUser,
}: Props) => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const handleCloseModal = () => {
    setIsCalling(false);
  };

  const handleDeclineCall = () => {
    handleCloseModal();
    socket.emit("decline-p2p-audio-call", {
      sender: {
        id: currentUser?.id,
        name: currentUser?.name,
        image: currentUser?.image,
      },
      receiver: sender?.id,
    });
  };

  const handleReceiveCall = () => {
    handleCloseModal();
    socket.emit("receive-p2p-audio-call", {
      sender: {
        id: currentUser?.id,
        name: currentUser?.name,
        image: currentUser?.image,
      },
      receiver: sender?.id,
    });
    const callRoomPath = `/call/audio/p2p/${sender?.id}?sender=${sender?.id}&receiver=${currentUser?.id}`;
    router.push(callRoomPath);
  };

  useEffect(() => {
    socket.on("cancel-p2p-audio-call", () => {
      setIsCalling(false);
      toast.success(`${sender?.name} has cancelled the call!`);
    });

    return () => {
      socket.off("cancel-p2p-audio-call");
    };
  }, [sender?.name, setIsCalling, socket]);

  return (
    <Modal
      open={isCalling}
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
          {sender?.name} is calling...
        </Typography>
        <Box className="flex flex-col justify-center items-center w-full my-5">
          <Avatar
            src={sender?.image}
            className="h-24 w-24 ring-2 rounded-full mb-4"
          />
          <Button variant="outlined">Audio call</Button>
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

export default IncomingAudioCall;
