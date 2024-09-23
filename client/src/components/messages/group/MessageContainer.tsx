import { useGetMessagesByChatIdQuery } from "@/features/message";
import { IGetMessage } from "@/interfaces/message.interface";
import { useRouter } from "next/router";
import MessageCard from "../common/MessageCard";

const MessageContainer = () => {
  const { query } = useRouter();
  const chatId = query?.chatId as string;
  const { data } = useGetMessagesByChatIdQuery(chatId);
  const messages = data?.data as IGetMessage[];
  return (
    <div className="h-full overflow-y-auto p-2">
      {messages?.map((message) => (
        <MessageCard key={message?.id} message={message} />
      ))}
    </div>
  );
};

export default MessageContainer;
