/* eslint-disable @next/next/no-img-element */
import {
  useGetUsersQuery,
  useLoggedInUserQuery,
} from "@/features/user/user.api";
import { IUser } from "@/interfaces/user.interface";
import React, { SetStateAction } from "react";

type Props = {
  setSelectedUser: (user: SetStateAction<IUser>) => void;
  selectedUser: IUser;
};

const UserList = ({ setSelectedUser, selectedUser }: Props) => {
  const { data } = useGetUsersQuery({});
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;
  const users =
    data?.data?.filter((sUser: IUser) => sUser?.id !== user?.id) || [];

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };
  return (
    <div>
      <ul>
        {users?.map((user: any) => (
          <>
            <li
              key={user.id}
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
          </>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
