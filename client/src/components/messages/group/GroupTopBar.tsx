import { AudioCall, VideoCall } from "@/components/calls";
import { useGetSingleChatQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { useRouter } from "next/router";
import ParticipantList from "./ParticipantList";
import { Avatar, Typography } from "@mui/material";
import GroupActions from "./GroupActions";

const GroupTopBar = () => {
  const { query } = useRouter();
  const chatId = query?.chatId as string;
  const groupName = query?.groupName as string;
  const groupImage = query?.groupImage as string;
  const { data } = useGetSingleChatQuery(chatId);
  const chat = data?.data as IGetChat;
  return (
    <div className="flex justify-between items-center p-2 bg-gray-200">
      <div className="flex gap-3">
        <div>
          {chat?.groupImage || groupImage ? (
            <Avatar
              className="h-12 w-12 rounded-full ring-1"
              src={chat?.groupImage || (groupImage as string)}
            />
          ) : (
            <Avatar>
              {chat?.groupName?.slice(0, 1).toUpperCase() ||
                groupName?.slice(0, 1).toUpperCase()}
            </Avatar>
          )}
        </div>
        <div>
          <Typography>{chat?.groupName || groupName}</Typography>
          <ParticipantList participants={chat?.participants} />
        </div>
      </div>
      <div className="flex gap-3">
        <AudioCall />
        <VideoCall />
        <GroupActions />
      </div>
    </div>
  );
};

export default GroupTopBar;
