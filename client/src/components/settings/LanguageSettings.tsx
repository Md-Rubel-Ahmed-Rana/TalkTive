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

const LanguageSettings = ({ expanded, handleAccordionChange }: Props) => {
  return (
    <Accordion
      expanded={expanded === "languageSettings"}
      onChange={handleAccordionChange("languageSettings")}
      className="shadow-md mt-4"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="languageSettings-content"
        id="languageSettings-header"
        className="bg-gray-100"
      >
        <Typography className="font-semibold">Language</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="ml-4 list-disc">
          <li>Select language</li>
          <li>Set regional formats</li>
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default LanguageSettings;
