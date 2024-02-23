/* eslint-disable @next/next/no-img-element */
import React from "react";

const NoUserSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-lg font-bold mb-4">Welcome to Talktive!</p>
      <p className="text-sm text-center mb-4">
        To start a conversation, select a user from your contacts or search for
        a user by name or email.
      </p>
    </div>
  );
};

export default NoUserSelected;
