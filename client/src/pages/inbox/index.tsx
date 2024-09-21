/* eslint-disable @next/next/no-img-element */
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import { MdMessage } from "react-icons/md";
import Sidebar from "@/components/messages/Sidebar";

const Inbox = () => {
  const router = useRouter();

  return (
    <>
      <GetHead
        title="Inbox - TalkTive"
        description="TalkTive inbox page"
        keywords="talktive, message, audio, video"
      />
      <div className="hidden lg:block">
        <div className="flex justify-center items-center h-screen w-full bg-gray-100">
          <Sidebar />
          <main className="flex-grow flex flex-col justify-center items-center h-full w-full bg-white  shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to your Messages
              </h1>
              <p className="text-gray-600 mb-6">
                Start a conversation with your team members to collaborate and
                keep track of your projects.
              </p>
              <button className="">
                <MdMessage className="text-6xl text-blue-500 mb-4" />
              </button>
            </div>
          </main>
        </div>
      </div>
      <div className="bg-gray-100 block lg:hidden">
        {/* <MobileLayout /> */}
      </div>
    </>
  );
};

export default Inbox;
