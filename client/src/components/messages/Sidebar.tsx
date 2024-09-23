import Link from "next/link";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SearchUserList from "./SearchUserList";
import ChatList from "./chatList";
import HomeIcon from "@mui/icons-material/Home";
import LogoutButton from "../shared/LogoutButton";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";

const Sidebar = () => {
  return (
    <>
      <aside className="w-1/5 lg:w-2/5 bg-gray-200 flex flex-col h-screen">
        <div className="flex items-center justify-between  p-4 lg:p-4 bg-gray-200 text-gray-800 shadow-md">
          <div className="flex items-center lg:gap-2">
            <QuestionAnswerIcon className="text-3xl text-blue-500" />
            <h1 className="hidden lg:block text-sm lg:text-xl font-bold text-blue-500">
              My Chats
            </h1>
          </div>
          <Link href={"/user/settings"}>
            <SettingsIcon className="cursor-pointer" />
          </Link>
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col justify-between h-full">
            <SearchUserList />
            <div className="h-[90vh] overflow-y-auto">
              <ChatList />
            </div>
            <div className="mb-16 lg:mb-0">
              <ul className="flex flex-col justify-between gap-3">
                <li className="w-full">
                  <Link
                    className={`px-4 py-2 flex items-center gap-2 text-xl text-gray-700 shadow-md w-full`}
                    href={"/"}
                  >
                    <HomeIcon />
                    <small className="hidden lg:block font-semibold">
                      Home
                    </small>
                  </Link>
                </li>
                <li className="w-full px-4 py-2">
                  <LogoutButton />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
