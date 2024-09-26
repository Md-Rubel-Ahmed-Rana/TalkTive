import { description } from "@/components/common/Welcome";
import GroupEdit from "@/components/groups/update-group";
import RootLayout from "@/layout";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const GroupEditPage = () => {
  const { query } = useRouter();
  return (
    <>
      <GetHead
        title={`Edit - ${query?.groupName || "Group details"} - Talktive`}
        description={description}
        keywords="talktive, message, audio, video"
      />
      <GroupEdit />
    </>
  );
};

export default GroupEditPage;

GroupEditPage.getLayout = function (page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
