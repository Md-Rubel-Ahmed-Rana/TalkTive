import { useGetMessagesByChatIdQuery } from "@/features/message";
import { IGetMessage } from "@/interfaces/message.interface";
import { useRouter } from "next/router";
import MessageCard from "../common/MessageCard";
import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import { Box, Typography } from "@mui/material";
import {
  handleDeletedMessage,
  handleNewMessage,
  handleUpdatedMessage,
} from "../utilFunctions";
import MessageSkeleton from "@/components/skeletons/MessageSkeleton";

const P2PMessageContainer = () => {
  const { socket, realTimeMessages, setRealTimeMessages } =
    useContext(SocketContext);
  const { query } = useRouter();
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const chatId = query?.chatId as string;
  const { data, isLoading } = useGetMessagesByChatIdQuery({
    chatId,
    participantId: user?.id,
  });
  const messages = data?.data as IGetMessage[];
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket?.on("new-message", (newMessage: IGetMessage) => {
      console.log("Got new message", newMessage);
      if (chatId === newMessage?.chatId) {
        handleNewMessage(newMessage, setRealTimeMessages);
      }
    });
    socket?.on("edited-message", (editedMessage: IGetMessage) => {
      if (chatId === editedMessage?.chatId) {
        handleUpdatedMessage(editedMessage, setRealTimeMessages);
      }
    });

    socket?.on("deleted-message", (messageId: string) => {
      handleDeletedMessage(messageId, setRealTimeMessages);
    });

    return () => {
      socket?.off("new-message");
      socket?.off("edited-message");
      socket?.off("deleted-message");
    };
  }, [socket, chatId, setRealTimeMessages, user?.id]);

  // Load messages when the component mounts or query changes
  useEffect(() => {
    if (!isLoading) {
      setRealTimeMessages(messages || []);
    }
  }, [isLoading, messages, setRealTimeMessages]);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [realTimeMessages, socket, setRealTimeMessages]);

  return (
    <>
      {isLoading ? (
        <MessageSkeleton />
      ) : (
        <>
          {realTimeMessages?.length > 0 ? (
            <Box
              ref={messagesContainerRef}
              className="h-full overflow-y-auto p-2"
            >
              {realTimeMessages?.map((message: IGetMessage) => (
                <MessageCard key={message?.id} message={message} />
              ))}
            </Box>
          ) : (
            <Box className="h-full flex justify-center items-center overflow-y-auto p-2">
              <Typography className="font-semibold text-xl text-gray-500">
                No messages
              </Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default P2PMessageContainer;
