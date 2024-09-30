import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SearchUserList from "./SearchUserList";
import ChatList from "./chatList";
import InboxActions from "./InboxActions";
import { Box, Typography } from "@mui/material";

const Sidebar = () => {
  return (
    <Box
      component={"aside"}
      className="w-1/5 lg:w-2/5 bg-gray-200 flex flex-col h-screen overflow-hidden"
    >
      <Box
        component={"div"}
        className="flex items-center justify-between  p-4 lg:p-4 bg-gray-200 text-gray-800 shadow-md border-r border-gray-400"
      >
        <Box component={"div"} className="flex items-center lg:gap-2">
          <QuestionAnswerIcon className="text-3xl text-blue-500" />
          <Typography className="hidden lg:block text-sm lg:text-xl font-bold text-blue-500">
            My Chats
          </Typography>
        </Box>
        <InboxActions />
      </Box>
      <Box component={"div"} className="flex-grow overflow-y-auto">
        <Box component={"div"} className="flex flex-col justify-between h-full">
          <SearchUserList />
          <Box
            component={"div"}
            className="h-[90vh] overflow-y-auto overflow-x-hidden"
          >
            <ChatList />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
