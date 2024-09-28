import { Box, Button, Typography } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";

const WelcomeToInbox = () => {
  return (
    <Box className="flex-grow flex flex-col justify-center items-center h-full w-full bg-white p-8">
      <Box className="text-center">
        <Typography
          component={"h1"}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Welcome To Talktive Platform
        </Typography>
        <Typography
          component={"p"}
          className="text-gray-600 mb-6 w-2/3 mx-auto"
        >
          Stay connected with your team like never before. Seamlessly chat,
          message, and engage in high-quality audio or video calls, all in one
          platform. Whether you&apos;re collaborating on projects, sharing
          updates, or just catching up, TalkTive makes every conversation
          meaningful and effortless. Welcome to the future of
          communication—simple, fast, and designed for your needs.
        </Typography>
        <Button variant="outlined">
          <MessageIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomeToInbox;
