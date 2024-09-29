import { IGetChat } from "@/interfaces/chat.interface";
import GroupChat from "./GroupChat";
import OneToOneChat from "./OneToOneChat";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";

type Props = {
  chat: IGetChat;
};

const ChatCard = ({ chat }: Props) => {
  const { socket } = useContext(SocketContext);
  const [typingChats, setTypingChats] = useState<string[]>([]);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;

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
    <div className="border-b py-2 border-blue-500 cursor-pointer hover:bg-gray-100">
      {chat?.isGroupChat ? (
        <GroupChat chat={chat} />
      ) : (
        <OneToOneChat chat={chat} typingChats={typingChats} />
      )}
    </div>
  );
};

export default ChatCard;
