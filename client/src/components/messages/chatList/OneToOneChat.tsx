import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import momentTimeFormat from "@/utils/momentTimeFormat";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";

type Props = {
  chat: IGetChat;
};

const OneToOneChat = ({ chat }: Props) => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user: IGetUser = userData?.data;
  const router = useRouter();
  const participant = chat?.participants?.filter(
    (participant) => participant?.id !== user?.id
  )[0];

  const handleSelectChat = () => {
    const path = `/inbox/messages/chat/p2p?chatId=${chat?.id}&userId=${participant?.id}&userName=${participant?.name}&userEmail=${participant?.email}&userImage=${participant?.image}`;
    router.push(path);
  };

  return (
    <div onClick={handleSelectChat} className="flex gap-2 w-full">
      <Avatar src={participant?.image as string} />
      <div className="w-full">
        <h3 className="font-semibold">{participant?.name}</h3>
        <p className="flex justify-between w-full">
          <small>{chat?.lastMessage?.content}</small>
          <small>{momentTimeFormat(chat?.lastMessage?.createdAt)}</small>
        </p>
      </div>
    </div>
  );
};

export default OneToOneChat;
