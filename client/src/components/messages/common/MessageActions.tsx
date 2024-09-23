import { IGetMessage } from "@/interfaces/message.interface";

import MessageDeleteButton from "../actions/MessageDeleteButton";
import MessageEditButton from "../actions/MessageEditButton";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import { useGetSingleChatQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";

type Props = {
  message: IGetMessage;
};

const MessageActions = ({ message }: Props) => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const { data } = useGetSingleChatQuery(message?.chatId);
  const chat = data?.data as IGetChat;
  return (
    <div className="flex items-center gap-2">
      {message?.content && message?.sender?.id === user?.id && (
        <MessageEditButton message={message} />
      )}
      {(message?.sender?.id === user?.id || chat?.admin?.id === user?.id) && (
        <MessageDeleteButton message={message} />
      )}
    </div>
  );
};

export default MessageActions;
