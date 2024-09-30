import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { useReadMessagesMutation } from "@/features/message";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import momentTimeFormat from "@/utils/momentTimeFormat";
import { Avatar, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getSenderName } from "../utilFunctions";

type Props = {
  chat: IGetChat;
};

const GroupChat = ({ chat }: Props) => {
  const { socket } = useContext(SocketContext);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user: IGetUser = userData?.data;
  const [readMessages] = useReadMessagesMutation();
  const router = useRouter();
  const sender = chat?.participants?.find(
    (user) => user?.id === chat?.lastMessage?.sender
  );
  const [lastTypingUser, setLastTypingUser] = useState<IGetUser | null>(null);

  const handleSelectChat = async () => {
    const path = `/inbox/messages/chat/group?chatId=${chat?.id}&groupName=${
      chat.groupName
    }&groupImage=${chat?.groupImage || ""}&adminId=${
      chat?.admin?.id
    }&adminName=${chat?.admin?.name}`;
    router.push(path);
    if (chat?.unreadMessage > 0) {
      await readMessages({ chatId: chat?.id, participantId: user?.id });
      socket.emit("chat-updated");
    }
  };

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
    <Box
      onClick={handleSelectChat}
      className="flex gap-2 w-full overflow-hidden"
    >
      {chat?.groupImage ? (
        <Avatar
          className="ring-2 ring-inherit"
          src={chat?.groupImage as string}
        />
      ) : (
        <Avatar className="ring-2 ring-inherit">
          {chat?.groupName?.slice(0, 1).toUpperCase()}
        </Avatar>
      )}
      <Box className="w-full overflow-hidden">
        <Box
          component={"div"}
          className="font-semibold flex justify-between items-center"
        >
          <Typography className="font-semibold">{chat?.groupName}</Typography>
          <Typography className="text-xs" component={"small"}>
            {momentTimeFormat(chat?.lastMessage?.createdAt)}
          </Typography>
        </Box>
        {lastTypingUser && lastTypingUser?.id ? (
          <Typography className="text-green-500 text-sm">{`${lastTypingUser?.name} is typing...`}</Typography>
        ) : (
          <>
            {chat?.lastMessage && chat?.lastMessage?.id ? (
              <Box className="flex justify-between w-full overflow-hidden">
                <Typography
                  component={"span"}
                  className="text-ellipsis truncate"
                >
                  {`${getSenderName(sender?.name as string)} : ${
                    chat?.lastMessage?.content
                  }`}
                </Typography>
                {chat?.unreadMessage > 0 ? (
                  <Typography
                    component={"span"}
                    className="bg-green-500 rounded-full w-2 h-2 p-2 flex justify-center items-center"
                  >
                    <Typography component={"small"} className="text-xs">
                      {chat?.unreadMessage}
                    </Typography>
                  </Typography>
                ) : null}
              </Box>
            ) : (
              <Typography>No message</Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default GroupChat;
