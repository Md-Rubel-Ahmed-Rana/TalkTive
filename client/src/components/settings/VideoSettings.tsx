import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = {
  expanded: string | boolean;
  handleAccordionChange: any;
};

const VideoSettings = ({ expanded, handleAccordionChange }: Props) => {
  return (
    <Accordion
      expanded={expanded === "videoSettings"}
      onChange={handleAccordionChange("videoSettings")}
      className="shadow-md mt-4"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="videoSettings-content"
        id="videoSettings-header"
        className="bg-gray-100"
      >
        <Typography className="font-semibold">Video</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="ml-4 list-disc">
          <li>Manage camera</li>
          <li>Set resolution</li>
          <li>Enable bg blur</li>
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default VideoSettings;
