import { description } from "@/components/common/Welcome";
import Settings from "@/components/settings";
import RootLayout from "@/layout";
import GetHead from "@/utils/Head";
import React, { ReactElement } from "react";

const SettingsPage = () => {
  return (
    <>
      <GetHead
        title="Settings - TalkTive"
        description={description}
        keywords="talktive, message, audio, video"
      />
      <Settings />
    </>
  );
};

export default SettingsPage;

SettingsPage.getLayout = function (page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
