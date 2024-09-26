import { useGetSingleChatQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

const GroupEdit = () => {
  const { query } = useRouter();
  const chatId = query?.id as string;
  const { data, isLoading } = useGetSingleChatQuery(chatId);
  const group = data?.data as IGetChat;

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <Box className="h-screen flex justify-center items-center">
      <Typography className="text-3xl font-semibold">
        {group?.groupName}
      </Typography>
    </Box>
  );
};

export default GroupEdit;
