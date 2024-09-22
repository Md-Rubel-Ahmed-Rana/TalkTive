/* eslint-disable react-hooks/exhaustive-deps */
import { description } from "@/components/common/Welcome";
import HomePage from "@/components/home";
import RootLayout from "@/layout";
import GetHead from "@/utils/Head";
import { ReactElement } from "react";

export default function Home() {
  return (
    <>
      <GetHead
        title="Home - TalkTive"
        description={description}
        keywords="talktive, message, audio, video"
      />
      <HomePage />
    </>
  );
}

Home.getLayout = function (page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
