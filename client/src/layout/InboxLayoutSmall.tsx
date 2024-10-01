import SearchUserList from "@/components/chatList/SearchUserList";
import ChatList from "@/components/chatList";
import InboxActions from "@/components/messages/InboxActions";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const InboxLayoutSmall = () => {
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex justify-between items-center gap-2 p-4 lg:p-4 bg-gray-200 text-gray-800 shadow-md">
        <div className="flex justify-center items-center gap-2  text-blue-600 text-lg">
          <QuestionAnswerIcon className="text-3xl" />
          <h1 className="lg:text-xl font-bold ">Messages</h1>
        </div>
        <InboxActions />
      </div>
      <SearchUserList />
      <div className="h-[90vh] overflow-y-auto">
        <ChatList />
      </div>
    </div>
  );
};

export default InboxLayoutSmall;
