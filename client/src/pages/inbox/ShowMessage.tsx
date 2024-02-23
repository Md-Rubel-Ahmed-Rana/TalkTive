/* eslint-disable @next/next/no-img-element */

import React from "react";
import moment from "moment";
import { formattedDate } from "@/utils/formattedDate";

const ShowMessages = () => {
  const messages: any = [
    {
      text: "Hello",
      createdAt: new Date(),
      poster: {
        image: "https://i.ibb.co/1MqspsL/user-Avater.png",
        name: "Kalim Uddin",
      },
    },
    {
      text: "Hello",
      createdAt: new Date(),
      poster: {
        image: "https://i.ibb.co/1MqspsL/user-Avater.png",
        name: "Rubel",
      },
    },
  ];

  return (
    <div className="h-96  overflow-hidden hover:overflow-auto">
      {messages?.map((post: any, index: number) => (
        <div key={post?.id} className="mx-auto p-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-4">
              <img
                src={post?.poster?.image}
                alt={post?.poster?.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex flex-col gap-1">
                <span className="font-bold">{post?.poster?.name}</span>
                <span className="text-sm text-gray-500">
                  {moment(post?.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
          <div className="mx-auto p-2">
            <p className="mb-4">{post?.text}</p>
            <p>{formattedDate(post.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowMessages;
