import { useGetMessagesByChatIdQuery } from "@/features/message";
import { IGetMessage } from "@/interfaces/message.interface";
import { useRouter } from "next/router";
import MessageCard from "./common/MessageCard";
import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";

const MessageContainer = () => {
  const { socket, realTimeMessages, setRealTimeMessages } =
    useContext(SocketContext);
  const { query } = useRouter();
  const chatId = query?.chatId as string;
  const { data, isLoading } = useGetMessagesByChatIdQuery(chatId);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const messages = data?.data as IGetMessage[];
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on("new-message", (newMessage: IGetMessage) => {
      try {
        console.log("NewMessage object:", newMessage);

        if (
          newMessage?.chatId === chatId &&
          newMessage?.sender?.id !== user?.id
        ) {
          setRealTimeMessages((prevMessages: IGetMessage[]) => [
            ...prevMessages,
            newMessage,
          ]);
        }
      } catch (error) {
        console.error("Error handling new message:", error);
      }
    });

    return () => {
      socket.off("new-message");
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
    <div ref={messagesContainerRef} className="h-full overflow-y-auto p-2">
      {realTimeMessages?.map((message: IGetMessage) => (
        <MessageCard key={message?.id} message={message} />
      ))}
    </div>
  );
};

export default MessageContainer;
