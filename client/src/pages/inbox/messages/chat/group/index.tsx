import GroupMessages from "@/components/messages/group";
import Sidebar from "@/components/messages/Sidebar";
import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

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
      <div className="hidden lg:block">
        <div className="flex justify-center items-center h-screen w-full bg-gray-100">
          <Sidebar />
          <GroupMessages />
        </div>
      </div>
      <div className="block lg:hidden">
        <GroupMessages />
      </div>
    </>
  );
};

export default GroupMessagesPage;
