import { IGetMedia } from "@/interfaces/message.interface";
import detectFileExtensionFromLink from "@/utils/detectFileExtensionFromLink";

type Props = {
  video: IGetMedia;
};

const MessageVideoPlayer = ({ video }: Props) => {
  const extension = detectFileExtensionFromLink(video?.url);
  return (
    <video
      controls
      className="w-full max-w-md h-60 lg:h-80 border rounded-md mt-1"
      preload="metadata"
    >
      <source src={video.url} type={`video/${extension}`} />
      Your browser does not support the video tag.
    </video>
  );
};

export default MessageVideoPlayer;
