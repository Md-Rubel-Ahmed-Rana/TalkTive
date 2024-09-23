/* eslint-disable @next/next/no-img-element */
import UserInfoPopOver from "@/components/shared/UserInfoPopOver";
import { IGetUser } from "@/interfaces/user.interface";
import moment from "moment";
import { useState } from "react";

type Props = {
  sender: IGetUser;
  messageCreatedAt: Date;
};

const MessageSender = ({ sender, messageCreatedAt }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="flex items-center mb-4">
      <img
        aria-describedby={sender.id}
        id={sender?.id}
        onClick={handleOpen}
        src={sender?.image}
        alt={sender?.name}
        className="w-12 h-12 rounded-full mr-4 cursor-pointer"
      />
      <div className="flex flex-col gap-1">
        <span className="font-bold text-xs lg:text-lg text-gray-700">
          {sender?.name}
        </span>
        <span className="text-sm text-gray-500">
          {moment(messageCreatedAt).fromNow()}
        </span>
      </div>
      <UserInfoPopOver
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        user={sender}
      />
    </div>
  );
};

export default MessageSender;
