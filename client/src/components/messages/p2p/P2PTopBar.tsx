import { AudioCall, VideoCall } from "@/components/calls";
import { useGetSingleUserInfoQuery } from "@/features/user";
import { IGetUser } from "@/interfaces/user.interface";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import P2PActions from "./P2PActions";
import ParticipantStatus from "./ParticipantStatus";

const P2PTopBar = () => {
  const router = useRouter();
  const userId = router.query?.userId as string;
  const userName = router.query?.userName as string;
  const userImage = router.query?.userImage as string;
  const { data: userData } = useGetSingleUserInfoQuery(userId);
  const participant = userData?.data as IGetUser;

  return (
    <div className="flex justify-between items-center p-2 bg-gray-200">
      <div className="flex gap-3">
        <div>
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
        </div>
        <ParticipantStatus participant={participant} />
      </div>
      <div className="flex gap-3">
        <AudioCall />
        <VideoCall />
        <P2PActions />
      </div>
    </div>
  );
};

export default P2PTopBar;
