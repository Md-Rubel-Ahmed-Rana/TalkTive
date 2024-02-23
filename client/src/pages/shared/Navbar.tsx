/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import { MdMessage } from "react-icons/md";
const Navbar = () => {
  const user = {
    email: "ruasdfgbsdjf",
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
          <img
            className="w-16 h-12 rounded-full"
            src="https://i.ibb.co/1MqspsL/user-Avater.png"
            alt=""
          />
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
            <button className="btn btn-ghost btn-circle">
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
            <div className="ml-5 btn btn-ghost">
              <Link href={"/inbox"}>
                <MdMessage className="h-5 w-5" />
              </Link>
            </div>
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
    </div>
  );
};

export default Navbar;
