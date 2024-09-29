import React from "react";
import MessageForm from "../common/MessageForm";
import GroupTopBar from "./GroupTopBar";
import GroupMessageContainer from "./GroupMessageContainer";

const GroupMessages = () => {
  return (
    <div className="h-screen lg:h-full w-full border flex flex-col justify-between">
      <GroupTopBar />
      <GroupMessageContainer />
      <MessageForm />
    </div>
  );
};

export default GroupMessages;
