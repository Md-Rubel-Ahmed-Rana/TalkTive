import { useGetMessagesByChatIdQuery } from "@/features/message";
import { IGetMessage } from "@/interfaces/message.interface";
import { useRouter } from "next/router";
import MessageCard from "../common/MessageCard";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "@/context/SocketContext";
import { Box } from "@mui/material";
import {
  handleDeletedMessage,
  handleNewMessage,
  handleUpdatedMessage,
} from "../utilFunctions";

const GroupMessageContainer = () => {
  const { socket, realTimeMessages, setRealTimeMessages } =
    useContext(SocketContext);
  const { query } = useRouter();
  const chatId = query?.chatId as string;
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const { data, isLoading } = useGetMessagesByChatIdQuery({
    chatId,
    participantId: user?.id,
  });
  const messages = data?.data as IGetMessage[];
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket?.on("new-message", (newMessage: IGetMessage) => {
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
    <Box ref={messagesContainerRef} className="h-full overflow-y-auto p-2">
      {realTimeMessages?.map((message: IGetMessage) => (
        <MessageCard key={message?.id} message={message} />
      ))}
    </Box>
  );
};

export default GroupMessageContainer;
