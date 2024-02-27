/* eslint-disable @next/next/no-img-element */
import { SocketContext } from "@/context/SocketContext";
import { useLoggedInUserQuery } from "@/features/user/user.api";
import { IUser } from "@/interfaces/user.interface";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useContext } from "react";
import { IoMdLogOut } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import UserSearchModal from "../modals/UserSearchModal";
const Navbar = () => {
  const { openUserSearchModal, setOpenUserSearchModal } =
    useContext(SocketContext);
  const { data }: any = useLoggedInUserQuery({});
  const user: IUser = data?.data;

  const handleLogOut = () => {
    Cookies.remove("talktiveAccessToken");
    window.location.replace("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        {!user?.email && (
          <img
            className="w-16 h-12 rounded-full"
            src="https://i.ibb.co/1MqspsL/user-Avater.png"
            alt=""
          />
        )}
        {user?.email && (
          <div className="flex items-center justify-center gap-3">
            <img
              className="w-12 h-12 object-cover rounded-full"
              src={user?.image}
              alt=""
            />
            <h3 className="text-xl font-semibold">{user.name}</h3>
          </div>
        )}
      </div>
      <div className="navbar-center">
        <Link href={"/"} className="btn btn-ghost text-xl">
          TalkTive
        </Link>
      </div>
      <div className="navbar-end">
        {user?.email && (
          <>
            <button
              onClick={() => setOpenUserSearchModal(true)}
              title="Search user to chat"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <Link href={"/inbox"}>
              <div title="Go to inbox" className="ml-5 btn btn-ghost">
                <MdMessage className="h-5 w-5" />
              </div>
            </Link>
            <button
              onClick={handleLogOut}
              title="Log out"
              className="ml-5 btn btn-ghost"
            >
              <IoMdLogOut className="h-5 w-5" />
            </button>
          </>
        )}
        {!user?.email && (
          <>
            <Link href={"/login"}>
              <button className="bg-blue-400 mr-2 px-4 py-2 rounded-md font-semibold">
                Login
              </button>
            </Link>
            <Link href={"/register"}>
              <button className="bg-blue-400 mr-2 px-4 py-2 rounded-md font-semibold">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
      {openUserSearchModal && <UserSearchModal />}
    </div>
  );
};

export default Navbar;
