import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Button } from "@mui/material";
import toast from "react-hot-toast";

const GroupAudioCall = () => {
  const handleMakeCall = () => {
    toast.success(
      "Feature unavailable. Stay with us to get the calling feature!. Thanks."
    );
  };
  return (
    <Button onClick={handleMakeCall} className="w-full" variant="outlined">
      <LocalPhoneIcon titleAccess="Make an audio call" />
    </Button>
  );
};

export default GroupAudioCall;
