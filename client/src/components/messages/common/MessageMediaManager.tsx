import { IGetMedia } from "@/interfaces/message.interface";
import MessageImage from "./MessageImage";
import MessageVideoPlayer from "./MessageVideoPlayer";
import MessageAudioPlayer from "./MessageAudioPlayer";
import MessageDocumentViewer from "./MessageDocumentViewer";

type Props = {
  media: IGetMedia[];
};

const MessageMediaManager = ({ media }: Props) => {
  return (
    <>
      {media?.map((file) => {
        if (file?.type === "image") {
          return <MessageImage image={file} key={file?.id} />;
        }
        if (file?.type === "video") {
          return <MessageVideoPlayer key={file?.id} video={file} />;
        }
        if (file?.type === "audio") {
          return <MessageAudioPlayer key={file?.id} audio={file} />;
        }
        if (file?.type === "document") {
          return <MessageDocumentViewer key={file?.id} document={file} />;
        }
      })}
    </>
  );
};

export default MessageMediaManager;
