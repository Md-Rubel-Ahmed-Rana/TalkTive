import { description } from "@/components/common/Welcome";
import GroupDetails from "@/components/groups/group-details";
import RootLayout from "@/layout";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const GroupDetailPage = () => {
  const { query } = useRouter();
  return (
    <>
      <GetHead
        title={`${query?.groupName || "Group details"} - Talktive`}
        description={description}
        keywords="talktive, message, audio, video"
      />
      <GroupDetails />
    </>
  );
};

export default GroupDetailPage;

GroupDetailPage.getLayout = function (page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
