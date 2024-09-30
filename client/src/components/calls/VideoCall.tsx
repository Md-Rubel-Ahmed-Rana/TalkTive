/* eslint-disable react-hooks/exhaustive-deps */
import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { useGetSingleUserInfoQuery } from "@/features/user";
import { IGetUser } from "@/interfaces/user.interface";
import VideocamIcon from "@mui/icons-material/Videocam";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const VideoCall = () => {
  const { socket } = useContext(SocketContext);
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const { query, push } = useRouter();
  const participantId = query?.userId as string;
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const { data } = useGetSingleUserInfoQuery(participantId);
  const participant = data?.data as IGetUser;

  useEffect(() => {
    socket.on("decline-video-call", (data: any) => {
      setIsVideoCalling(false);
      toast.success(`${participant?.name} has declined your call!`);
    });

    socket.on("video-call-accepted", (data: any) => {
      setIsVideoCalling(false);
      push(`/call/video/${user?.id}`);
      toast.success(`${participant?.name} has accepted your call!`);
    });

    return () => {
      socket?.off("decline-video-call");
      socket?.off("video-call-accepted");
    };
  }, [socket]);

  const handleMakeVideoCall = async () => {
    setIsVideoCalling(true);

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // Public STUN server
      ],
    });

    const offer = await peerConnection.createOffer({
      offerToReceiveVideo: true,
      offerToReceiveAudio: true,
    });

    await peerConnection.setLocalDescription(offer);

    const videoDataPack = {
      sender: {
        id: user?.id,
        name: user?.name,
        image: user?.image,
      },
      receiver: participantId,
      videoOffer: {
        sdp: offer.sdp,
        type: offer.type,
        video: true,
        audio: true,
      },
      callType: "video",
      timestamp: new Date().toISOString(),
    };

    socket.emit("send-video-call", videoDataPack);
  };

  const handleCloseModal = () => {
    setIsVideoCalling(false);
  };

  const handleCancelCall = () => {
    setIsVideoCalling(false);
    socket.emit("cancel-video-call", {
      sender: { id: user?.id, name: user?.name, image: user?.image },
      receiver: participantId,
    });
  };

  return (
    <>
      <Button
        onClick={handleMakeVideoCall}
        className="w-full"
        variant="outlined"
      >
        <VideocamIcon titleAccess="Make a video call" />
      </Button>
      <Modal
        open={isVideoCalling}
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
            {participant?.name}
          </Typography>
          <Box className="flex justify-center flex-col items-center w-full my-5">
            <Avatar
              src={participant?.image}
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

export default VideoCall;
