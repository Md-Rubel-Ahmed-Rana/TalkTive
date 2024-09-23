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

const CallFeatures = ({ expanded, handleAccordionChange }: Props) => {
  return (
    <Accordion
      expanded={expanded === "callFeatures"}
      onChange={handleAccordionChange("callFeatures")}
      className="shadow-md mt-4"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="callFeatures-content"
        id="callFeatures-header"
        className="bg-gray-100"
      >
        <Typography className="font-semibold">Call Features</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="ml-4 list-disc">
          <li>Mute/unmute microphone</li>
          <li>Toggle video on/off</li>
          <li>Switch devices</li>
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default CallFeatures;
