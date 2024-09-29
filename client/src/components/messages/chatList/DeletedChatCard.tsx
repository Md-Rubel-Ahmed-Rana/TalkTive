import { useGetLoggedInUserQuery } from "@/features/auth";
import { useRestoreDeletedChatMutation } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";

type Props = {
  chat: IGetChat;
  setOpen: (value: boolean) => void;
};

const DeletedChatCard = ({ chat, setOpen }: Props) => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const [restoreChat, { isLoading: isRestoring }] =
    useRestoreDeletedChatMutation();
  const participant = chat?.participants?.filter((p) => p?.id !== user?.id)[0];

  const handleRestoreChat = async () => {
    const failedMessage = "Failed to restore chat. Try again!";
    try {
      const result: any = await restoreChat({
        chatId: chat?.id,
        participantId: user?.id,
      });
      if (result?.data?.statusCode === 200) {
        toast.success(result?.data?.message || "Restored deleted chat");
      } else {
        toast.error(
          result?.data?.message || result?.error?.data?.message || failedMessage
        );
      }
    } catch (error: any) {
      toast.error(error?.message || failedMessage);
      setOpen(false);
    }
  };

  return (
    <Box
      className="ring-1 rounded-md p-3 flex justify-between items-center"
      key={chat?.id}
    >
      <Box>
        {chat?.isGroupChat ? (
          <Box className="flex items-center gap-3">
            {chat?.groupImage ? (
              <Avatar src={chat?.groupImage as string} />
            ) : (
              <Avatar>{chat?.groupName?.slice(0, 1).toUpperCase()}</Avatar>
            )}
            <Typography>{chat?.groupName}</Typography>
          </Box>
        ) : (
          <Box className="flex items-center gap-3">
            {participant.image ? (
              <Avatar src={participant?.image as string} />
            ) : (
              <Avatar>{participant?.name?.slice(0, 1).toUpperCase()}</Avatar>
            )}
            <Typography>{participant?.name}</Typography>
          </Box>
        )}
      </Box>
      <Button
        disabled={isRestoring}
        onClick={handleRestoreChat}
        variant="contained"
        className="bg-blue-600"
      >
        {isRestoring ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Restore"
        )}
      </Button>
    </Box>
  );
};

export default DeletedChatCard;
