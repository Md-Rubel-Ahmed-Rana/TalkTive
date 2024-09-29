import { AudioCall, VideoCall } from "@/components/calls";
import { useGetSingleChatQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { useRouter } from "next/router";
import ParticipantList from "./ParticipantList";
import { Avatar, Box, Button, Typography } from "@mui/material";
import GroupActions from "./GroupActions";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { IGetUser } from "@/interfaces/user.interface";

const GroupTopBar = () => {
  const { socket } = useContext(SocketContext);
  const { query, push } = useRouter();
  const chatId = query?.chatId as string;
  const groupName = query?.groupName as string;
  const groupImage = query?.groupImage as string;
  const { data } = useGetSingleChatQuery(chatId);
  const chat = data?.data as IGetChat;
  const [lastTypingUser, setLastTypingUser] = useState<IGetUser | null>(null);
  const groupDetailsLink = `/groups/${chat?.id}?groupId=${chat?.id}&groupName=${
    chat?.groupName
  }&groupImage=${chat?.groupImage || ""}`;

  useEffect(() => {
    socket?.on(
      "start-typing-message",
      ({ chatId, sender }: { chatId: string; sender: string }) => {
        if (chatId === chat?.id) {
          const startTypingUser = chat.participants.find(
            (user) => user?.id === sender
          ) as IGetUser;
          setLastTypingUser(startTypingUser);
        }
      }
    );
    socket?.on(
      "stop-typing-message",
      ({ chatId, sender }: { chatId: string; sender: string }) => {
        if (chatId === chat?.id) {
          setLastTypingUser(null);
        }
      }
    );

    return () => {
      socket?.off("start-typing-message");
      socket?.off("stop-typing-message");
    };
  }, [chat?.id, chat?.participants, socket]);

  return (
    <Box className="flex justify-between items-center p-2 bg-gray-200">
      <Box className="flex items-center gap-3">
        <Box
          onClick={() => push(groupDetailsLink)}
          className="cursor-pointer"
          title="See group details"
        >
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
        </Box>
        <Box>
          <Typography>{chat?.groupName || groupName}</Typography>
          {lastTypingUser && lastTypingUser?.id ? (
            <Typography className="text-green-500 text-sm">{`${lastTypingUser?.name} is typing...`}</Typography>
          ) : (
            <ParticipantList participants={chat?.participants} />
          )}
        </Box>
      </Box>
      <Box className="hidden lg:block">
        <Box className="flex gap-3">
          <AudioCall />
          <VideoCall />
          <GroupActions isButton={true} chatId={chat?.id} />
        </Box>
      </Box>
      <Box className="lg:hidden block">
        <GroupActions chatId={chat?.id} />
      </Box>
    </Box>
  );
};

export default GroupTopBar;
