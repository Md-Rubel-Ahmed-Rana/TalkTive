import { IGetMessage } from "@/interfaces/message.interface";

import MessageDeleteButton from "../actions/MessageDeleteButton";
import MessageEditButton from "../actions/MessageEditButton";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";

type Props = {
  message: IGetMessage;
};

const MessageActions = ({ message }: Props) => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  return (
    <div className="flex items-center gap-2">
      {message?.content && message?.sender?.id === user?.id && (
        <MessageEditButton message={message} />
      )}
      {message?.sender?.id === user?.id && (
        <MessageDeleteButton message={message} />
      )}
    </div>
  );
};

export default MessageActions;
