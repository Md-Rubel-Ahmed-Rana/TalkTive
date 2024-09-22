/* eslint-disable @next/next/no-img-element */
import { IGetUser } from "@/interfaces/user.interface";
import moment from "moment";
import Link from "next/link";

type Props = {
  sender: IGetUser;
  messageCreatedAt: Date;
};

const MessagePoster = ({ sender, messageCreatedAt }: Props) => {
  return (
    <div className="flex items-center mb-4">
      <Link
        href={`/messages/chats/${sender?.id}?participantId=${sender?.id}&name=${sender?.name}&email=${sender?.email}&profile_picture=${sender?.image}`}
      >
        <img
          src={sender?.image}
          alt={sender?.name}
          className="w-12 h-12 rounded-full mr-4"
        />
      </Link>
      <div className="flex flex-col gap-1">
        <span className="font-bold text-xs lg:text-lg text-gray-700">
          {sender?.name}
        </span>
        <span className="text-sm text-gray-500">
          {moment(messageCreatedAt).fromNow()}
        </span>
      </div>
    </div>
  );
};

export default MessagePoster;
