import React from "react";
import MessageContainer from "../MessageContainer";
import MessageForm from "../common/MessageForm";
import GroupTopBar from "./GroupTopBar";

const GroupMessages = () => {
  return (
    <div className="h-full w-full border flex flex-col justify-between">
      <GroupTopBar />
      <MessageContainer />
      <MessageForm />
    </div>
  );
};

export default GroupMessages;
