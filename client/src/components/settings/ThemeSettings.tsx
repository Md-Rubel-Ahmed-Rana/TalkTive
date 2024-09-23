import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import Switch from "@mui/material/Switch";

type Props = {
  expanded: string | boolean;
  handleAccordionChange: any;
};

const ThemeSettings = ({ expanded, handleAccordionChange }: Props) => {
  const [theme, setTheme] = useState("Light");
  return (
    <Accordion
      expanded={expanded === "themeSettings"}
      onChange={handleAccordionChange("themeSettings")}
      className="shadow-md mt-4"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="themeSettings-content"
        id="themeSettings-header"
        className="bg-gray-100"
      >
        <Typography className="font-semibold">Theme</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="ml-4 list-disc">
          <li>
            <p className="flex justify-between items-center">
              <span>Mode: {theme}</span>
              <Switch
                defaultValue={theme}
                onClick={() =>
                  setTheme((prev) => (prev === "Light" ? "Dark" : "Light"))
                }
              />
            </p>
          </li>
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default ThemeSettings;
