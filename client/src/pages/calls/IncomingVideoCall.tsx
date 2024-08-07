import { useLoggedInUserQuery } from "@/features/user/user.api";
import useGetLoggedInUser from "@/hooks/useGetLoggedInUser";
import { IUser } from "@/interfaces/user.interface";
import { useRouter } from "next/router";
import React from "react";
import { MdCall, MdCallEnd } from "react-icons/md";

const IncomingVideoCall = ({
  isVideoCalling,
  setIsVideoCalling,
  caller,
}: any) => {
  const router = useRouter();
  const user: IUser = useGetLoggedInUser();
  const handleAcceptCall = () => {
    router.push({
      pathname: "video-call",
      query: {
        callerId: caller?.id,
        callerName: caller?.name,
        idToCall: user?.id,
        calleeName: user?.name,
      },
    });
    setIsVideoCalling(false);
  };

  return (
    <>
      {isVideoCalling && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg z-50">
            <h2 className="text-2xl font-bold mb-4">Incoming video call</h2>
            <h3>{caller.name} is calling</h3>
            <div className="flex justify-between mt-10 gap-10">
              <button
                className="bg-red-500 hover:bg-red-700 w-full text-white  px-4 py-2 flex justify-center font-bold  rounded"
                onClick={() => setIsVideoCalling(false)}
              >
                <MdCallEnd className="h-10 w-10" />
              </button>
              <button
                onClick={handleAcceptCall}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 flex justify-center w-full font-bold rounded-lg"
              >
                <MdCall className="h-10 w-10" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IncomingVideoCall;
