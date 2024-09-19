import { SocketContext } from "@/context/SocketContext";
import {
  useGetUsersQuery,
  useLoggedInUserQuery,
} from "@/features/user/user.api";
import { IUser } from "@/interfaces/user.interface";
import customStyles from "@/utils/reactSelectCustomStyle";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Select from "react-select";

const UserSearchInput = () => {
  const { data } = useGetUsersQuery({});
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;
  const users: IUser[] =
    data?.data?.filter((sUser: IUser) => sUser?.id !== user?.id) || [];
  const router = useRouter();

  const handleSelect = (user: any) => {
    const selectedUser = users.find(
      (sUser: IUser) => sUser?.id === user?.value
    );
    const queries = `/inbox?userId=${selectedUser?.id}&userName=${selectedUser?.name}&userEmail=${selectedUser?.email}&userImage=${selectedUser?.image}`;
    router.push(queries);
  };

  return (
    <div>
      <Select
        options={users.map((user: IUser) => ({
          label: user?.name,
          value: user?.id,
        }))}
        styles={customStyles}
        onChange={handleSelect}
        placeholder="Type a name to chat"
        className="w-full h-full shadow-md"
        classNamePrefix="select2-selection"
        noOptionsMessage={({ inputValue }: any) =>
          !inputValue && "User not found"
        }
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
};

export default UserSearchInput;
