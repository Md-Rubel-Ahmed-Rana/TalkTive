import { IGetChat } from "@/interfaces/chat.interface";
import GroupChat from "./GroupChat";
import OneToOneChat from "./OneToOneChat";

type Props = {
  chat: IGetChat;
};

const ChatCard = ({ chat }: Props) => {
  return (
    <div className="border-b py-2 border-blue-500 cursor-pointer hover:bg-gray-100">
      {chat?.isGroupChat ? (
        <GroupChat chat={chat} />
      ) : (
        <OneToOneChat chat={chat} />
      )}
    </div>
  );
};

export default ChatCard;
