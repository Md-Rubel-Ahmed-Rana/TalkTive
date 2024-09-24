import { TiMessages } from "react-icons/ti";
import Link from "next/link";
import SearchUserList from "@/components/messages/SearchUserList";
import ChatList from "@/components/messages/chatList";

const InboxLayoutSmall = () => {
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex justify-between items-center gap-2 p-4 lg:p-4 bg-gray-200 text-gray-800 shadow-md">
        <div className="flex justify-center items-center gap-2  text-blue-600 text-lg">
          <TiMessages className="text-3xl" />
          <h1 className="lg:text-xl font-bold ">Messages</h1>
        </div>
        <div className="flex justify-end gap-1 text-blue-700 text-sm">
          <Link href={"/"}>Home</Link>|
          <Link href={"/dashboard"}>Dashboard</Link>
        </div>
      </div>
      <SearchUserList />
      <div className="h-[90vh] overflow-y-auto">
        <ChatList />
      </div>
    </div>
  );
};

export default InboxLayoutSmall;
