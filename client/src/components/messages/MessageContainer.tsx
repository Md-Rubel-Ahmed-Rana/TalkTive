import { useGetMessagesByChatIdQuery } from "@/features/message";
import { IGetMessage } from "@/interfaces/message.interface";
import { useRouter } from "next/router";

const MessageContainer = () => {
  const { query } = useRouter();
  const chatId = query?.chatId as string;
  const { data } = useGetMessagesByChatIdQuery(chatId);
  const messages = data?.data as IGetMessage[];
  console.log(messages);
  return <div>This is message container: {messages?.length}</div>;
};

export default MessageContainer;
