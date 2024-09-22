import { IGetMessage } from "@/interfaces/message.interface";
import MessagePoster from "./MessagePoster";
import { detectLinks } from "@/utils/detectLinkFromText";
import { formattedDate } from "@/utils/formattedDate";
import MessageMediaManager from "./MessageMediaManager";

type Props = {
  message: IGetMessage;
};

const MessageCard = ({ message }: Props) => {
  return (
    <div key={message?.id} className="mx-auto border-b py-6">
      <div className="flex  justify-between items-start">
        <MessagePoster
          sender={message?.sender}
          messageCreatedAt={message?.createdAt}
        />
      </div>
      {message?.content && (
        <div
          className="mb-3 text-gray-700"
          dangerouslySetInnerHTML={{
            __html: message?.content
              ? detectLinks(message?.content).join(" ")
              : "",
          }}
        />
      )}
      {message?.media?.length > 0 && (
        <MessageMediaManager media={message?.media} />
      )}
      <p className="mt-2 text-gray-400">{formattedDate(message?.createdAt)}</p>
    </div>
  );
};

export default MessageCard;
