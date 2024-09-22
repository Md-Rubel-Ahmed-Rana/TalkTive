import { IGetUser } from "@/interfaces/user.interface";
import { formatLastActive } from "@/utils/lastSeenFormatter";
import { useState, useEffect } from "react";

interface ParticipantStatusProps {
  participant: IGetUser;
}

const ParticipantStatus: React.FC<ParticipantStatusProps> = ({
  participant,
}) => {
  const isOnline = participant?.status === "online";
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const typingEvent = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(typingEvent);
  }, []);

  return (
    <div>
      <h2>{participant?.name}</h2>
      {isTyping ? (
        <p>Typing...</p>
      ) : isOnline ? (
        <p>Online</p>
      ) : (
        <p>
          {participant?.lastActive
            ? formatLastActive(participant.lastActive)
            : "Unavailable"}
        </p>
      )}
    </div>
  );
};

export default ParticipantStatus;
