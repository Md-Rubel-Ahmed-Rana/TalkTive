import React, { useState } from "react";
import UserPreferences from "./UserPreferences";
import ThemeSettings from "./ThemeSettings";
import ChatSettings from "./ChatSettings";
import GroupChatSettings from "./GroupChatSettings";
import AudioSettings from "./AudioSettings";
import VideoSettings from "./VideoSettings";
import CallFeatures from "./CallFeatures";
import LanguageSettings from "./LanguageSettings";
import { Typography } from "@mui/material";

const Settings: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <section className="flex">
      <div className="p-4 bg-white w-2/5 lg:w-1/5">
        <UserPreferences
          expanded={expanded}
          handleAccordionChange={handleAccordionChange}
        />
        <ThemeSettings
          expanded={expanded}
          handleAccordionChange={handleAccordionChange}
        />
        <ChatSettings
          expanded={expanded}
          handleAccordionChange={handleAccordionChange}
        />
        <GroupChatSettings
          expanded={expanded}
          handleAccordionChange={handleAccordionChange}
        />
        <AudioSettings
          expanded={expanded}
          handleAccordionChange={handleAccordionChange}
        />
        <VideoSettings
          expanded={expanded}
          handleAccordionChange={handleAccordionChange}
        />
        <CallFeatures
          expanded={expanded}
          handleAccordionChange={handleAccordionChange}
        />
        <LanguageSettings
          expanded={expanded}
          handleAccordionChange={handleAccordionChange}
        />
      </div>
      <div className="w-3/5 lg:w-4/5 flex justify-center items-center">
        <Typography className="font-bold text-2xl">
          individual setting actions
        </Typography>
      </div>
    </section>
  );
};

export default Settings;
