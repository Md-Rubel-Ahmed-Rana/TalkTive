import VideoCallRoom from "@/components/calls/VideoCallRoom";
import RootLayout from "@/layout";
import GetHead from "@/utils/Head";
import { ReactElement } from "react";

const VideoCallPage = () => {
  return (
    <>
      <GetHead
        title="Video call - TalkTive"
        description="TalkTive inbox page"
        keywords="talktive, message, audio, video"
      />
      <VideoCallRoom />
    </>
  );
};

export default VideoCallPage;

VideoCallPage.getLayout = function (page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
