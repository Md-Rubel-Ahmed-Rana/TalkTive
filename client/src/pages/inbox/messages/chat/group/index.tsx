import GroupMessages from "@/components/messages/group";
import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import InboxLayoutLarge from "@/layout/InboxLayoutLarge";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";

const GroupMessagesPage = () => {
  const { query } = useRouter();
  const groupName = query?.groupName as string;
  const { socket } = useContext(SocketContext);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;

  useEffect(() => {
    if (user && user?.id) {
      socket.emit("join-room", user?.id);
    }
  }, [socket, user]);
  return (
    <>
      <GetHead
        title={`Messages - ${groupName}`}
        description="TalkTive inbox page"
        keywords="talktive, message, audio, video"
      />
      <GroupMessages />
    </>
  );
};

export default GroupMessagesPage;

GroupMessagesPage.getLayout = function (page: ReactElement) {
  return <InboxLayoutLarge>{page}</InboxLayoutLarge>;
};
