import VideoCallRoom from "@/components/calls/VideoCallRoom";
import GetHead from "@/utils/Head";

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
