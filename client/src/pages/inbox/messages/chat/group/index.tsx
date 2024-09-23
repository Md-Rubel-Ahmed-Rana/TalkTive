import GroupMessages from "@/components/messages/group";
import InboxLayoutLarge from "@/layout/InboxLayoutLarge";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import { ReactElement } from "react";

const GroupMessagesPage = () => {
  const { query } = useRouter();
  const groupName = query?.groupName as string;
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
