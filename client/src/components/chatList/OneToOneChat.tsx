import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import momentTimeFormat from "@/utils/momentTimeFormat";
import { Avatar, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import LastMessage from "./P2PLastMessage";
import CircleIcon from "@mui/icons-material/Circle";
import { useReadMessagesMutation } from "@/features/message";
import { useContext } from "react";
import { SocketContext } from "@/context/SocketContext";

type Props = {
  chat: IGetChat;
  typingChats: string[];
};

const OneToOneChat = ({ chat, typingChats }: Props) => {
  const { socket } = useContext(SocketContext);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user: IGetUser = userData?.data;
  const router = useRouter();
  const participant = chat?.participants?.filter(
    (participant) => participant?.id !== user?.id
  )[0];
  const [readMessages] = useReadMessagesMutation();

  const isOnline = participant?.status === "online";

  const handleSelectChat = async () => {
    const path = `/inbox/messages/chat/p2p?chatId=${chat?.id}&userId=${participant?.id}&userName=${participant?.name}&userEmail=${participant?.email}&userImage=${participant?.image}`;
    router.push(path);
    if (chat?.unreadMessage > 0) {
      await readMessages({ chatId: chat?.id, participantId: user?.id });
      socket.emit("chat-updated");
    }
  };

  return (
    <Box onClick={handleSelectChat} className="flex gap-2 w-full">
      <Box component={"div"} className="relative">
        {participant?.image ? (
          <Avatar
            className="ring-2 ring-inherit"
            src={participant?.image as string}
          />
        ) : (
          <Avatar className="ring-2 ring-inherit">
            {participant?.name?.slice(0, 1).toUpperCase()}
          </Avatar>
        )}
        <Box component={"span"} className="absolute bottom-0 right-1">
          <CircleIcon
            className={`text-sm  ${
              isOnline ? "text-green-500" : "text-gray-500"
            }`}
          />
        </Box>
      </Box>

      <Box className="w-full overflow-hidden">
        <Box
          component={"div"}
          className="font-semibold flex justify-between items-center"
        >
          <Typography variant="inherit" component={"h2"}>
            {participant?.name}
          </Typography>
          <Typography className="text-xs" component={"small"}>
            {momentTimeFormat(chat?.lastMessage?.createdAt)}
          </Typography>
        </Box>
        {typingChats?.includes(chat?.id) ? (
          <Typography className="text-green-500 text-sm" component={"p"}>
            Typing...
          </Typography>
        ) : (
          <Typography
            component={"p"}
            className="flex justify-between w-[99%] overflow-hidden"
          >
            <LastMessage lastMessage={chat?.lastMessage} />
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
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default OneToOneChat;
