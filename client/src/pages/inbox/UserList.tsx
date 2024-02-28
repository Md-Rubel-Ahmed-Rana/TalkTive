/* eslint-disable @next/next/no-img-element */
import { SocketContext } from "@/context/SocketContext";
import {
  useGetSortedChatUsersQuery,
  useLoggedInUserQuery,
} from "@/features/user/user.api";
import { IUser } from "@/interfaces/user.interface";
import React, { useContext } from "react";

const UserList = () => {
  const { selectedUser, handleSelectUser }: any = useContext(SocketContext);
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;
  const { data } = useGetSortedChatUsersQuery(user?.id);
  const users = data?.data;

  const handleUserClick = (user: any) => {
    handleSelectUser(user);
  };
  return (
    <div>
      {users?.length > 0 && (
        <h3 className="text-xl ml-4 mb-2 font-semibold">
          Recently talked to them
        </h3>
      )}

      <ul>
        {users?.map((user: any) => (
          <div key={user.id}>
            <li
              className={`p-4 cursor-pointer flex items-center gap-3 ${
                selectedUser?.id === user.id ? "bg-gray-200" : ""
              }`}
              onClick={() => handleUserClick(user)}
            >
              <img
                className="w-12 h-10 rounded-full"
                src={user?.image || "https://i.ibb.co/1MqspsL/user-Avater.png"}
                alt=""
              />
              <p>{user.name}</p>
            </li>
            <hr />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
