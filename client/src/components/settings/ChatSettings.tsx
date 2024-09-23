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

const ChatSettings = ({ expanded, handleAccordionChange }: Props) => {
  return (
    <Accordion
      expanded={expanded === "chatSettings"}
      onChange={handleAccordionChange("chatSettings")}
      className="shadow-md mt-4"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="chatSettings-content"
        id="chatSettings-header"
        className="bg-gray-100"
      >
        <Typography className="font-semibold">Chat</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="ml-4 list-disc">
          <li>Auto delete</li>
          <li>Chat backups</li>
          <li>Translation</li>
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default ChatSettings;
