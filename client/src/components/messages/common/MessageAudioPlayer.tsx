import { IGetMedia } from "@/interfaces/message.interface";
import detectFileExtensionFromLink from "@/utils/detectFileExtensionFromLink";

type Props = {
  audio: IGetMedia;
};

const MessageAudioPlayer = ({ audio }: Props) => {
  const extension = detectFileExtensionFromLink(audio?.url);
  return (
    <audio
      controls
      className="w-full max-w-md border rounded-full mt-1"
      preload="metadata"
    >
      <source src={audio.url} type={`audio/${extension}`} />
      Your browser does not support the audio element.
    </audio>
  );
};

export default MessageAudioPlayer;
