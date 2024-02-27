import { SocketContext } from "@/context/SocketContext";
import {
  useGetUsersQuery,
  useLoggedInUserQuery,
} from "@/features/user/user.api";
import { IUser } from "@/interfaces/user.interface";
import customStyles from "@/utils/reactSelectCustomStyle";
import React, { useContext } from "react";
import Select from "react-select";

const UserSearchInput = () => {
  const { handleSelectUser }: any = useContext(SocketContext);
  const { data } = useGetUsersQuery({});
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;
  const users: IUser[] =
    data?.data?.filter((sUser: IUser) => sUser?.id !== user?.id) || [];

  const handleSelect = (user: any) => {
    const selected = users.find((sUser: IUser) => sUser?.id === user?.value);
    if (selected) {
      handleSelectUser(selected);
    }
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
        placeholder="Type a name to search"
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
