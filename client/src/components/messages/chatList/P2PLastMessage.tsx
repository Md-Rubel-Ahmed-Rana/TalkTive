import { IGetLastMessage } from "@/interfaces/chat.interface";
import { IGetMedia } from "@/interfaces/message.interface";
import ImageIcon from "@mui/icons-material/Image";
import MicIcon from "@mui/icons-material/Mic";
import VideocamIcon from "@mui/icons-material/Videocam";
import DescriptionIcon from "@mui/icons-material/Description";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Typography } from "@mui/material";

type Props = {
  lastMessage: IGetLastMessage;
};

const LastMessage = ({ lastMessage }: Props) => {
  const lastMedia: IGetMedia =
    lastMessage?.media && lastMessage?.media[lastMessage?.media?.length - 1];
  return (
    <Box component={"div"} className="overflow-hidden">
      {lastMessage?.content ? (
        <Typography component={"p"} className="flex items-center">
          {lastMessage?.status === "sent" ? (
            <DoneIcon className="text-md text-blue-500" />
          ) : (
            lastMessage?.status === "read" && (
              <DoneAllIcon className="text-md text-blue-500" />
            )
          )}
          <Typography component={"span"} className="text-ellipsis truncate">
            {lastMessage?.content}
          </Typography>
        </Typography>
      ) : (
        <Typography component={"p"}>
          {lastMessage?.status === "sent" ? (
            <DoneIcon className="text-md text-blue-500" />
          ) : (
            lastMessage?.status === "read" && (
              <DoneAllIcon className="text-md text-blue-500" />
            )
          )}
          {lastMedia?.type === "image" ? (
            <ImageIcon className="text-md text-blue-500" />
          ) : lastMedia?.type === "audio" ? (
            <MicIcon className="text-md text-blue-500" />
          ) : lastMedia?.type === "video" ? (
            <VideocamIcon className="text-md text-blue-500" />
          ) : (
            <DescriptionIcon />
          )}
          <Typography component={"span"}>{lastMedia?.type}</Typography>
        </Typography>
      )}
    </Box>
  );
};

export default LastMessage;
