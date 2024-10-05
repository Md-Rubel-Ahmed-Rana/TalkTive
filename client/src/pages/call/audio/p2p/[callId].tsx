import P2PAudioCallRoom from "@/components/calls/audio/one-to-one/P2PAudioCallRoom";
import GetHead from "@/utils/Head";
import React from "react";

const P2PAudioCallPage = () => {
  return (
    <>
      <GetHead
        title="Audio call - TalkTive"
        description="TalkTive call page"
        keywords="talktive, message, audio, video"
      />
      <P2PAudioCallRoom />
    </>
  );
};

export default P2PAudioCallPage;
