import React, { useContext } from "react";
import UserSearchInput from "../inbox/UserSearchInput";
import { SocketContext } from "@/context/SocketContext";
import { RxCross2 } from "react-icons/rx";

const UserSearchModal = () => {
  const { setOpenUserSearchModal } = useContext(SocketContext);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-10 rounded-lg z-50 relative lg:w-1/3 w-full">
        <button
          className="absolute top-2 right-2 bg-blue-600 p-2 rounded-full text-white"
          onClick={() => setOpenUserSearchModal(false)}
        >
          <RxCross2 />
        </button>
        <div className="w-full">
          <UserSearchInput />
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
