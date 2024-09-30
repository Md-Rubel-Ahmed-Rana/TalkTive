import { IGetMessage } from "@/interfaces/message.interface";
import MessageSender from "./MessageSender";
import { detectLinks } from "@/utils/detectLinkFromText";
import { formattedDate } from "@/utils/formattedDate";
import MessageMediaManager from "./MessageMediaManager";
import MessageActions from "./MessageActions";
import { Box, Button, Typography } from "@mui/material";
import { VideoDetector } from "../utilFunctions";

type Props = {
  message: IGetMessage;
};

const MessageCard = ({ message }: Props) => {
  const videoEmbedUrl = VideoDetector(message?.content);

  return (
    <Box component={"div"} key={message?.id} className="mx-auto border-b py-6">
      <Box component={"div"} className="flex justify-between items-start">
        <MessageSender
          sender={message?.sender}
          messageCreatedAt={message?.createdAt}
        />
        <MessageActions message={message} />
      </Box>
      {message?.content && (
        <>
          {videoEmbedUrl ? (
            <Box component={"div"}>
              <iframe
                src={videoEmbedUrl}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              />
              <a href={videoEmbedUrl} target="_blank" rel="noopener noreferrer">
                <Button className="mt-2" variant="outlined" size="small">
                  Link
                </Button>
              </a>
            </Box>
          ) : (
            <Box
              component={"div"}
              className="mb-3 text-gray-700"
              dangerouslySetInnerHTML={{
                __html: message?.content
                  ? detectLinks(message?.content).join(" ")
                  : "",
              }}
            />
          )}
        </>
      )}
      {message?.media?.length > 0 && (
        <MessageMediaManager media={message?.media} />
      )}
      <Typography component={"p"} className="mt-2 text-gray-400">
        {formattedDate(message?.createdAt)}
      </Typography>
    </Box>
  );
};

export default MessageCard;
