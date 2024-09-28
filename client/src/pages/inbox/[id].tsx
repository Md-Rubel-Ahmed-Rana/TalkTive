import GetHead from "@/utils/Head";
import Sidebar from "@/components/messages/Sidebar";
import InboxLayoutSmall from "@/layout/InboxLayoutSmall";
import { Box } from "@mui/material";
import WelcomeToInbox from "./WelcomeToInbox";

const Inbox = () => {
  return (
    <>
      <GetHead
        title="Inbox - TalkTive"
        description="TalkTive inbox page"
        keywords="talktive, message, audio, video"
      />
      <Box component={"main"} className="hidden lg:block">
        <Box className="flex justify-center items-center h-screen w-full bg-gray-100">
          <Sidebar />
          <Box className="flex justify-center items-center h-screen w-full">
            <WelcomeToInbox />
          </Box>
        </Box>
      </Box>
      <Box className="block lg:hidden" component={"section"}>
        <InboxLayoutSmall />
      </Box>
    </>
  );
};

export default Inbox;
