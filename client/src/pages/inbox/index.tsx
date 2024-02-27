/* eslint-disable @next/next/no-img-element */
import Layout from "@/layout";
import React, { ReactElement, useContext, useRef, useState } from "react";
import ShowMessages from "./ShowMessage";
import { MdOutlineCall, MdOutlineVideoCall } from "react-icons/md";
import NoUserSelected from "./NoUserSelected";
import MessageForm from "./MessageForm";
import UserList from "./UserList";
import { IUser, userInitData } from "@/interfaces/user.interface";
import Peer from "simple-peer";
import { SocketContext } from "@/context/SocketContext";
import { useLoggedInUserQuery } from "@/features/user/user.api";
import VideoRoom from "../calls/VideoRoom";
import UserSearchInput from "./UserSearchInput";

const Inbox = () => {
  const {
    socket,
    me,
    stream,
    userVideo,
    setCallAccepted,
    connectionRef,
    idToCall,
    setIsCalled,
    isCalled,
    setIsVideoCalling,
  }: any = useContext(SocketContext);
  const [selectedUser, setSelectedUser] = useState<IUser>(userInitData);
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;

  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: user.name,
      });
      setIsCalled(true);
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal: any) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  return (
    <div className="flex py-5">
      <div className="w-1/4 border-r">
        <div className="mb-2">
          <UserSearchInput setSelectedUser={setSelectedUser} />
        </div>
        {/* // users list  */}
        <UserList
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
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
                onClick={() => callUser(idToCall)}
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
      {isCalled && (
        <VideoRoom
          callee={selectedUser}
          setIsVideoCalling={setIsVideoCalling}
        />
      )}
    </div>
  );
};

Inbox.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Inbox;
