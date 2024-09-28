import OneToOneMessages from "@/components/messages/p2p";
import Sidebar from "@/components/messages/Sidebar";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";

const OneToOneMessagesPage = () => {
  const { query } = useRouter();
  const participantName = query?.userName as string;

  return (
    <>
      <GetHead
        title={`Messages - ${participantName || "User name"}`}
        description="TalkTive inbox page"
        keywords="talktive, message, audio, video"
      />
      <div className="hidden lg:block">
        <div className="flex justify-center items-center h-screen w-full bg-gray-100">
          <Sidebar />
          <OneToOneMessages />
        </div>
      </div>
      <div className="block lg:hidden">
        <OneToOneMessages />
      </div>
    </>
  );
};

export default OneToOneMessagesPage;
