import { useGetLoggedInUserQuery } from "@/features/auth";
import { useGetMyChatListQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import ChatCard from "./ChatCard";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/context/SocketContext";
import toast from "react-hot-toast";

const ChatList = () => {
  const { socket } = useContext(SocketContext);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user: IGetUser = userData?.data;
  const { data: chatData, refetch } = useGetMyChatListQuery(user?.id);
  const chats = (chatData?.data as IGetChat[]) || [];

  useEffect(() => {
    socket.on("chat-updated", () => {
      refetch().then(() => {
        toast.success("Got new message and chat list updated!");
      });
    });

    return () => {
      socket.off("chat-updated");
    };
  }, [socket, refetch]);

  return (
    <div className="px-1">
      {chats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </div>
  );
};

export default ChatList;
