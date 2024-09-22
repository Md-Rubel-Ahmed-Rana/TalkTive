import { IGetChat } from "@/interfaces/chat.interface";
import momentTimeFormat from "@/utils/momentTimeFormat";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";

type Props = {
  chat: IGetChat;
};

const GroupChat = ({ chat }: Props) => {
  const router = useRouter();
  const sender = chat?.participants?.find(
    (user) => user?.id === chat?.lastMessage?.sender
  );

  const handleSelectChat = () => {
    const path = `/inbox/messages/chat/group?chatId=${chat?.id}&groupName=${
      chat.groupName
    }&groupImage=${chat?.groupImage || ""}&adminId=${
      chat?.admin?.id
    }&adminName=${chat?.admin?.name}`;
    router.push(path);
  };

  return (
    <div onClick={handleSelectChat} className="flex gap-2 w-full">
      {chat?.groupImage ? (
        <Avatar src={chat?.groupImage as string} />
      ) : (
        <Avatar>{chat?.groupName?.slice(0, 1).toUpperCase()}</Avatar>
      )}
      <div className="w-full">
        <h3 className="font-semibold">{chat?.groupName}</h3>
        {chat?.lastMessage && chat?.lastMessage?.id ? (
          <div className="flex justify-between w-full">
            <p className="flex items-center gap-2">
              <small>{sender?.name}:</small>
              <small>{chat?.lastMessage?.content}</small>
            </p>
            <small>{momentTimeFormat(chat?.lastMessage?.createdAt)}</small>
          </div>
        ) : (
          <p>No message</p>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
