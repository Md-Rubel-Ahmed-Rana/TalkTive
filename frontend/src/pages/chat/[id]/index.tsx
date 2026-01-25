import ChatContainer from "@/chat";
import PageMetadata from "@/common/PageMetadata";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";

const ChatPage = () => {
  const { query } = useRouter();
  const name = query?.name as string;
  return (
    <>
      <PageMetadata
        title={`Chat - ${name || "Talktive"}`}
        description="Welcome to Talktive - Your Ultimate Communication Solution!"
        keywords="Talktive, Home"
      />
      <DashboardLayout>
        <ChatContainer />
      </DashboardLayout>
    </>
  );
};

export default ChatPage;
