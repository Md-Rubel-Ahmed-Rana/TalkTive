import { useGetLoggedInUserQuery } from "@/features/auth";
import { useGetMyChatListQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import ChatCard from "./ChatCard";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/context/SocketContext";
import { Box, Typography } from "@mui/material";
import CheckListSkeleton from "../skeletons/CheckListSkeleton";

const ChatList = () => {
  const { socket } = useContext(SocketContext);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user: IGetUser = userData?.data;
  const {
    data: chatData,
    refetch,
    isLoading,
  } = useGetMyChatListQuery(user?.id);
  const chats = (chatData?.data as IGetChat[]) || [];

  useEffect(() => {
    socket?.on("chat-updated", () => {
      refetch().then(() => {});
    });

    return () => {
      socket?.off("chat-updated");
    };
  }, [socket, refetch]);

  return (
    <>
      {isLoading ? (
        <CheckListSkeleton />
      ) : (
        <>
          {chats?.length > 0 ? (
            <Box component={"div"} className="px-2">
              {chats.map((chat) => (
                <ChatCard key={chat.id} chat={chat} />
              ))}
            </Box>
          ) : (
            <Box
              component={"div"}
              className="px-2 flex justify-center items-center h-full"
            >
              <Typography className="text-xl font-semibold text-gray-500">
                No chats
              </Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default ChatList;
