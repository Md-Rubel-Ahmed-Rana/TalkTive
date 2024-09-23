import OneToOneMessages from "@/components/messages/p2p";
import InboxLayoutLarge from "@/layout/InboxLayoutLarge";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const OneToOneMessagesPage = () => {
  const { query } = useRouter();
  const participantName = query?.userName as string;
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
