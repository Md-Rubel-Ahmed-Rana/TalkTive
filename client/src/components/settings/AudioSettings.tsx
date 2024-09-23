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

const AudioSettings = ({ expanded, handleAccordionChange }: Props) => {
  return (
    <Accordion
      expanded={expanded === "audioSettings"}
      onChange={handleAccordionChange("audioSettings")}
      className="shadow-md mt-4"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="audioSettings-content"
        id="audioSettings-header"
        className="bg-gray-100"
      >
        <Typography className="font-semibold">Audio</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="ml-4 list-disc">
          <li>Select microphone</li>
          <li>Manage audio quality</li>
          <li>Manage echo</li>
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default AudioSettings;
