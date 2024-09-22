import OneToOneMessages from "@/components/messages/p2p";
import InboxLayoutLarge from "@/layout/InboxLayoutLarge";
import GetHead from "@/utils/Head";
import React, { ReactElement } from "react";

const OneToOneMessagesPage = () => {
  return (
    <>
      <GetHead
        title="Messages - TalkTive"
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
