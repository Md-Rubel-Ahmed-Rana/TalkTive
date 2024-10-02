import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { useGetSingleUserInfoQuery } from "@/features/user";
import { IGetUser } from "@/interfaces/user.interface";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const P2PAudioCall = () => {
  const { socket } = useContext(SocketContext);
  const { query, push } = useRouter();
  const participantId = query?.userId as string;
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const { data } = useGetSingleUserInfoQuery(participantId);
  const participant = data?.data as IGetUser;
  const [isAudioCalling, setIsAudioCalling] = useState(false);

  const handleMakeCall = () => {
    setIsAudioCalling(true);
    socket.emit("offer-p2p-audio-call", {
      sender: { id: user?.id, name: user?.name, image: user?.image },
      receiver: participantId,
    });
  };

  const handleCancelCall = () => {
    setIsAudioCalling(false);
    socket.emit("cancel-p2p-audio-call", {
      sender: { id: user?.id, name: user?.name, image: user?.image },
      receiver: participantId,
    });
  };

  useEffect(() => {
    socket.on(
      "decline-p2p-audio-call",
      ({ sender }: { sender: { id: string; name: string; image: string } }) => {
        setIsAudioCalling(false);
        toast.success(`${sender?.name} has declined your call!`);
      }
    );

    socket.on(
      "receive-p2p-audio-call",
      ({ sender }: { sender: { id: string; name: string; image: string } }) => {
        setIsAudioCalling(false);
        toast.success(`${sender?.name} has accepted your call!`);
        const callRoomPath = `/call/audio/p2p?sender=${user?.id}&receiver=${participant?.id}`;
        push(callRoomPath);
      }
    );

    return () => {
      socket.off("decline-p2p-audio-call");
      socket.off("receive-p2p-audio-call");
    };
  }, [participant?.id, push, socket, user?.id]);

  return (
    <>
      <Button onClick={handleMakeCall} className="w-full" variant="outlined">
        <LocalPhoneIcon titleAccess="Make an audio call" />
      </Button>
      <Modal
        open={isAudioCalling}
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

export default P2PAudioCall;
