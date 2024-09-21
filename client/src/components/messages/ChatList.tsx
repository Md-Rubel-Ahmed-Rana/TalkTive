import { useGetLoggedInUserQuery } from "@/features/auth";
import { useGetMyChatListQuery } from "@/features/chat";
import { IGetUser } from "@/interfaces/user.interface";

const ChatList = () => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user: IGetUser = userData?.data;
  const { data } = useGetMyChatListQuery(user?.id);
  console.log(data);
  return <div>This is chat list: {data?.data?.length}</div>;
};

export default ChatList;
