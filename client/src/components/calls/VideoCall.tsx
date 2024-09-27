import VideocamIcon from "@mui/icons-material/Videocam";
import { Button } from "@mui/material";
import toast from "react-hot-toast";

const VideoCall = () => {
  const handleMakeCall = () => {
    toast.success(
      "Feature unavailable. Stay with us to get the calling feature!. Thanks."
    );
  };
  return (
    <Button onClick={handleMakeCall} className="w-full" variant="outlined">
      <VideocamIcon titleAccess="Make a video call" />
    </Button>
  );
};

export default VideoCall;
