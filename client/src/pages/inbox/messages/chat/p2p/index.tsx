import OneToOneMessages from "@/components/messages/p2p";
import { SocketContext } from "@/context/SocketContext";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import InboxLayoutLarge from "@/layout/InboxLayoutLarge";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import React, { ReactElement, useContext, useEffect } from "react";

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
      <OneToOneMessages />
    </>
  );
};

export default OneToOneMessagesPage;

OneToOneMessagesPage.getLayout = function (page: ReactElement) {
  return <InboxLayoutLarge>{page}</InboxLayoutLarge>;
};
