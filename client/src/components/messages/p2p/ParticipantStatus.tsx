import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import { formatLastActive } from "@/utils/lastSeenFormatter";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";

interface ParticipantStatusProps {
  participant: IGetUser;
}

const ParticipantStatus: React.FC<ParticipantStatusProps> = ({
  participant,
}) => {
  const isOnline = participant?.status === "online";
  const { socket } = useContext(SocketContext);
  const [typingChats, setTypingChats] = useState<string[]>([]);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const { query } = useRouter();
  const chatId = query?.chatId as string;

  useEffect(() => {
    socket?.on(
      "start-typing-message",
      ({ chatId, receiver }: { chatId: string; receiver: string }) => {
        if (receiver === user?.id) {
          setTypingChats((prev) =>
            !prev.includes(chatId) ? [...prev, chatId] : prev.concat(chatId)
          );
        }
      }
    );
    socket?.on(
      "stop-typing-message",
      ({ chatId, receiver }: { chatId: string; receiver: string }) => {
        if (receiver === user?.id) {
          setTypingChats((prev) => prev.filter((chat) => chat !== chatId));
        }
      }
    );

    return () => {
      socket?.off("start-typing-message");
      socket?.off("stop-typing-message");
    };
  }, [socket, user?.id]);

  return (
    <Box component={"div"}>
      <Typography>{participant?.name}</Typography>
      {typingChats.includes(chatId) ? (
        <Typography component={"p"} className="text-green-500 text-sm">
          Typing...
        </Typography>
      ) : isOnline ? (
        <Typography component={"p"}>Online</Typography>
      ) : (
        <Typography component={"p"}>
          {participant?.lastActive
            ? formatLastActive(participant?.lastActive)
            : ""}
        </Typography>
      )}
    </Box>
  );
};

export default ParticipantStatus;
