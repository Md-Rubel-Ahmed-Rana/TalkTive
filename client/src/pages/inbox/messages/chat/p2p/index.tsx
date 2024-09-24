import OneToOneMessages from "@/components/messages/p2p";
import Sidebar from "@/components/messages/Sidebar";
import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

const OneToOneMessagesPage = () => {
  const { query } = useRouter();
  const participantName = query?.userName as string;
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
        title={`Messages - ${participantName}`}
        description="TalkTive inbox page"
        keywords="talktive, message, audio, video"
      />
      <div className="hidden lg:block">
        <div className="flex justify-center items-center h-screen w-full bg-gray-100">
          <Sidebar />
          <OneToOneMessages />
        </div>
      </div>
      <div className="block lg:hidden">
        <OneToOneMessages />
      </div>
    </>
  );
};

export default OneToOneMessagesPage;
