import { useGetLoggedInUserQuery } from "@/features/auth";
import { useGetMyChatListQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import ChatCard from "./ChatCard";

const ChatList = () => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user: IGetUser = userData?.data;
  const { data: chatData } = useGetMyChatListQuery(user?.id);
  const chats = (chatData?.data as IGetChat[]) || [];
  return (
    <div className="px-1">
      {chats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </div>
  );
};

export default ChatList;
