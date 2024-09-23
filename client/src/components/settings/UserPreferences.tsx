import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Switch,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import ProfilePictureChange from "../userInfos/ProfilePictureChange";

type Props = {
  expanded: string | boolean;
  handleAccordionChange: any;
};

const UserPreferences = ({ expanded, handleAccordionChange }: Props) => {
  const [lastSeen, setLastSeen] = useState("On");
  const [isChangeImage, setIsChangeImage] = useState(false);
  return (
    <>
      <Accordion
        expanded={expanded === "userPreferences"}
        onChange={handleAccordionChange("userPreferences")}
        className="shadow-md"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="userPreferences-content"
          id="userPreferences-header"
          className="bg-gray-100"
        >
          <Typography className="font-semibold">Preferences</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            className="w-full"
            onClick={() => setIsChangeImage(true)}
            variant="outlined"
          >
            Change image
          </Button>
          <Button className="my-2 w-full" variant="outlined">
            Update user info
          </Button>
          <p className="flex justify-between items-center">
            <span>Last seen: {lastSeen}</span>
            <Switch
              defaultValue={lastSeen}
              defaultChecked
              onClick={() =>
                setLastSeen((prev) => (prev === "On" ? "Off" : "On"))
              }
            />
          </p>
        </AccordionDetails>
      </Accordion>
      <ProfilePictureChange open={isChangeImage} setOpen={setIsChangeImage} />
    </>
  );
};

export default UserPreferences;
