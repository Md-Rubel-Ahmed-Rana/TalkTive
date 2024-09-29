import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SearchUserList from "./SearchUserList";
import ChatList from "./chatList";
import InboxActions from "./InboxActions";

const Sidebar = () => {
  return (
    <>
      <aside className="w-1/5 lg:w-2/5 bg-gray-200 flex flex-col h-screen">
        <div className="flex items-center justify-between  p-4 lg:p-4 bg-gray-200 text-gray-800 shadow-md border-r border-gray-400">
          <div className="flex items-center lg:gap-2">
            <QuestionAnswerIcon className="text-3xl text-blue-500" />
            <h1 className="hidden lg:block text-sm lg:text-xl font-bold text-blue-500">
              My Chats
            </h1>
          </div>
          <InboxActions />
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col justify-between h-full">
            <SearchUserList />
            <div className="h-[90vh] overflow-y-auto">
              <ChatList />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
