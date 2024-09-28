import GroupMessages from "@/components/messages/group";
import Sidebar from "@/components/messages/Sidebar";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";

const GroupMessagesPage = () => {
  const { query } = useRouter();
  const groupName = query?.groupName as string;

  return (
    <>
      <GetHead
        title={`Messages - ${groupName || "Group name"}`}
        description="TalkTive inbox page"
        keywords="talktive, message, audio, video"
      />
      <div className="hidden lg:block">
        <div className="flex justify-center items-center h-screen w-full bg-gray-100">
          <Sidebar />
          <GroupMessages />
        </div>
      </div>
      <div className="block lg:hidden">
        <GroupMessages />
      </div>
    </>
  );
};

export default GroupMessagesPage;
