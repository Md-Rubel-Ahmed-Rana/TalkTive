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

const GroupChatSettings = ({ expanded, handleAccordionChange }: Props) => {
  return (
    <Accordion
      expanded={expanded === "groupChatSettings"}
      onChange={handleAccordionChange("groupChatSettings")}
      className="shadow-md mt-4"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="groupChatSettings-content"
        id="groupChatSettings-header"
        className="bg-gray-100"
      >
        <Typography className="font-semibold">Group Chat</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="ml-4 list-disc">
          <li>Manage members</li>
          <li>Set description and rules</li>
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default GroupChatSettings;
