import { IGetChat } from "@/interfaces/chat.interface";
import momentTimeFormat from "@/utils/momentTimeFormat";
import { Avatar } from "@mui/material";

type Props = {
  chat: IGetChat;
};

const GroupChat = ({ chat }: Props) => {
  return (
    <div className="flex gap-2 w-full">
      {chat?.groupImage ? (
        <Avatar src={chat?.groupImage as string} />
      ) : (
        <Avatar>{chat?.groupName?.slice(0, 1).toUpperCase()}</Avatar>
      )}
      <div className="w-full">
        <h3 className="font-semibold">{chat?.groupName}</h3>
        {chat?.lastMessage && chat?.lastMessage?.id ? (
          <p className="flex justify-between w-full">
            <small>{chat?.lastMessage?.content}</small>
            <small>{momentTimeFormat(chat.lastMessage.createdAt)}</small>
          </p>
        ) : (
          <p>No message</p>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
