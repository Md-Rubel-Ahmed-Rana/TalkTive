/* eslint-disable @next/next/no-img-element */
import Layout from "@/layout";
import React, { ReactElement, useContext } from "react";
import ShowMessages from "./ShowMessage";
import { MdOutlineCall, MdOutlineVideoCall } from "react-icons/md";
import NoUserSelected from "./NoUserSelected";
import MessageForm from "./MessageForm";
import UserList from "./UserList";
import { IUser } from "@/interfaces/user.interface";
import { SocketContext } from "@/context/SocketContext";
import { useLoggedInUserQuery } from "@/features/user/user.api";
import UserSearchInput from "./UserSearchInput";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";

const Inbox = () => {
  const { selectedUser }: any = useContext(SocketContext);
  const router = useRouter();

  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;

  const handleVideoCallStart = () => {
    router.push({
      pathname: "video-call",
      query: {
        callerId: user.id,
        callerName: user.name,
        idToCall: selectedUser?.id,
        calleeName: selectedUser?.name,
      },
    });
  };

  return (
    <>
      <GetHead
        title="Inbox-TalkTive"
        description="TalkTive inbox page"
        keywords="talktive, message, audio, video"
      />

      <div className="flex py-5">
        <div className="w-1/4 border-r">
          <div className="mb-2">
            <UserSearchInput />
          </div>
          {/* // users list  */}
          <UserList />
        </div>
        <div className="w-3/4">
          {selectedUser.id && (
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
                <button
                  onClick={handleVideoCallStart}
                  className="bg-gray-300 px-3 py-1 rounded-md"
                >
                  <MdOutlineVideoCall className="w-7 h-7" />
                </button>
              </div>
            </div>
          )}
          {selectedUser?.name !== "" ? (
            <>
              <ShowMessages selectedUser={selectedUser} />
              <MessageForm selectedUser={selectedUser} />
            </>
          ) : (
            <NoUserSelected />
          )}
        </div>
      </div>
    </>
  );
};

Inbox.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Inbox;
