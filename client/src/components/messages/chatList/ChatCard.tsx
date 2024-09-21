import { IGetChat } from "@/interfaces/chat.interface";
import GroupChat from "./GroupChat";
import OneToOneChat from "./OneToOneChat";

type Props = {
  chat: IGetChat;
};

const ChatCard = ({ chat }: Props) => {
  console.log(chat);
  return (
    <div className="border-b py-2 border-blue-500">
      {chat?.isGroupChat ? (
        <GroupChat chat={chat} />
      ) : (
        <OneToOneChat chat={chat} />
      )}
    </div>
  );
};

export default ChatCard;
