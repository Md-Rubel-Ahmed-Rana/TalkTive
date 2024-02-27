/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useRef } from "react";
import moment from "moment";
import { formattedDate } from "@/utils/formattedDate";
import { SocketContext } from "@/context/SocketContext";
import { IMessage } from "@/interfaces/message.interface";
import { useGetMessagesQuery } from "@/features/message/message.api";
import { useLoggedInUserQuery } from "@/features/user/user.api";
import { IUser } from "@/interfaces/user.interface";

type Props = {
  selectedUser: IUser;
};

const ShowMessages = ({ selectedUser }: Props) => {
  const { socket, realTimeMessages, setRealTimeMessages }: any =
    useContext(SocketContext);
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;
  const { data: messageData } = useGetMessagesQuery({
    sender: user?.id,
    receiver: selectedUser?.id,
  });

  const messages: IMessage[] = messageData?.data;

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMessage = (data: IMessage) => {
      setRealTimeMessages((prev: IMessage[]) => [...prev, data]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [setRealTimeMessages, socket]);

  // keep updated message in state
  useEffect(() => {
    setRealTimeMessages(messages);
  }, [messages, setRealTimeMessages]);

  // keep user in the bottom of the message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [realTimeMessages, socket]);

  return (
    <div
      ref={messagesContainerRef}
      className="h-96  overflow-hidden hover:overflow-auto"
    >
      {realTimeMessages?.map((message: IMessage) => (
        <div key={message?.id} className="mx-auto p-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-4">
              <img
                src={message?.sender?.image}
                alt={message?.sender?.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex flex-col gap-1">
                <span className="font-bold">{message?.sender?.name}</span>
                <span className="text-sm text-gray-500">
                  {moment(message?.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
          <div className="mx-auto p-2">
            <p className="mb-4">{message?.content}</p>
            <p>{formattedDate(message.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowMessages;
