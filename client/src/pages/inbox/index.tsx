/* eslint-disable @next/next/no-img-element */
import Layout from "@/layout";
import React, { ReactElement, useState } from "react";

import ShowMessages from "./ShowMessage";
import { MdOutlineCall, MdOutlineVideoCall } from "react-icons/md";
import NoUserSelected from "./NoUserSelected";
import MessageForm from "./MessageForm";

const users = [
  { id: 1, name: "Rubel", image: "https://i.ibb.co/1MqspsL/user-Avater.png" },
  {
    id: 2,
    name: "Bodrul Amin",
    image: "https://i.ibb.co/1MqspsL/user-Avater.png",
  },
  {
    id: 3,
    name: "Najim Uddin",
    image: "https://i.ibb.co/1MqspsL/user-Avater.png",
  },
  {
    id: 4,
    name: "Ahad Uddin",
    image: "https://i.ibb.co/1MqspsL/user-Avater.png",
  },
];

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex py-5">
      <div className="w-1/4 border-r">
        <div className="mb-2">
          <input
            type="text"
            className="px-4 py-6 w-full shadow-md outline-none focus:border"
            placeholder="Search dears to chat"
          />
        </div>
        <ul>
          {users.map((user: any) => (
            <>
              <li
                key={user.id}
                className={`p-4 cursor-pointer flex items-center gap-3 ${
                  selectedUser?.id === user.id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleUserClick(user)}
              >
                <img
                  className="w-12 h-10 rounded-full"
                  src={
                    user?.image || "https://i.ibb.co/1MqspsL/user-Avater.png"
                  }
                  alt=""
                />
                <p>{user.name}</p>
              </li>
              <hr />
            </>
          ))}
        </ul>
      </div>
      <div className="w-3/4">
        {selectedUser && (
          <div className="p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-10 rounded-full"
                src={
                  selectedUser?.image ||
                  "https://i.ibb.co/1MqspsL/user-Avater.png"
                }
                alt=""
              />
              <h4 className="text-2xl font-semibold">{selectedUser.name}</h4>
            </div>
            <div className="flex gap-3 items-center">
              <button className="bg-gray-300 px-3 py-1 rounded-md">
                <MdOutlineCall className="w-7 h-7" />
              </button>
              <button className="bg-gray-300 px-3 py-1 rounded-md">
                <MdOutlineVideoCall className="w-7 h-7" />
              </button>
            </div>
          </div>
        )}
        {selectedUser?.name ? (
          <>
            <ShowMessages />
            <MessageForm />
          </>
        ) : (
          <NoUserSelected />
        )}
      </div>
    </div>
  );
};

Inbox.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Inbox;
