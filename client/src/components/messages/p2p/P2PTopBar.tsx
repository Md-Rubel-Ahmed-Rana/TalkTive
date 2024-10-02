import { useGetSingleUserInfoQuery } from "@/features/user";
import { IGetUser } from "@/interfaces/user.interface";
import { Avatar, Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import P2PActions from "./P2PActions";
import ParticipantStatus from "./ParticipantStatus";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/context/SocketContext";
import MessageTopBarSkeleton from "@/components/skeletons/MessageTopBarSkeleton";
import { VideoCallNegotiation } from "@/components/calls/video/one-to-one";
import { P2PAudioCall } from "@/components/calls/audio/one-to-one";

const P2PTopBar = () => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const userId = router.query?.userId as string;
  const userName = router.query?.userName as string;
  const userImage = router.query?.userImage as string;
  const {
    data: userData,
    refetch,
    isLoading,
  } = useGetSingleUserInfoQuery(userId);
  const participant = userData?.data as IGetUser;

  const detailsLink = `/user/profile/${participant?.id}?userName=${participant?.name}&userEmail=${participant?.email}&userImage=${participant?.image}`;

  useEffect(() => {
    socket?.on("user-status", (data: { userId: string; status: string }) => {
      if (participant?.id === data?.userId) {
        refetch().then(() => {});
      }
    });

    return () => {
      socket?.off("user-status");
    };
  }, [participant, refetch, socket]);

  return (
    <>
      {isLoading ? (
        <MessageTopBarSkeleton />
      ) : (
        <Box
          component={"div"}
          className="flex justify-between items-center p-2 bg-gray-200"
        >
          <Box component={"div"} className="flex gap-3">
            <Box
              component={"div"}
              className="cursor-pointer"
              onClick={() => router.push(detailsLink)}
            >
              {participant?.image || userImage ? (
                <Avatar
                  className="h-12 w-12 rounded-full ring-1"
                  src={participant?.image || (userImage as string)}
                />
              ) : (
                <Avatar>
                  {participant?.name?.slice(0, 1).toUpperCase() ||
                    userName?.slice(0, 1).toUpperCase()}
                </Avatar>
              )}
            </Box>
            <ParticipantStatus participant={participant} />
          </Box>
          <Box component={"div"} className="hidden lg:block">
            <Box component={"div"} className="flex gap-3">
              <P2PAudioCall />
              <VideoCallNegotiation />
              <Button variant="outlined">
                <P2PActions />
              </Button>
            </Box>
          </Box>
          <Box component={"div"} className="lg:hidden block">
            <P2PActions />
          </Box>
        </Box>
      )}
    </>
  );
};

export default P2PTopBar;
