import {
  useGetUsersQuery,
  useLoggedInUserQuery,
} from "@/features/user/user.api";
import { IUser } from "@/interfaces/user.interface";
import customStyles from "@/utils/reactSelectCustomStyle";
import React, { SetStateAction } from "react";
import Select from "react-select";

type Props = {
  setSelectedUser: (user: SetStateAction<IUser>) => void;
};

const UserSearchInput = ({ setSelectedUser }: Props) => {
  const { data } = useGetUsersQuery({});
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;
  const users: IUser[] =
    data?.data?.filter((sUser: IUser) => sUser?.id !== user?.id) || [];

  const handleSelectUser = (user: { label: string; value: string }) => {
    const selected = users.find((sUser: IUser) => sUser.id === user.value);
    if (selected) {
      setSelectedUser(selected);
    }
  };

  // remove default indicators from react-select
  //   const elements = document.getElementsByClassName(
  //     "css-1hb7zxy-IndicatorsContainer"
  //   );
  //   for (let i = 0; i < elements.length; i++) {
  //     const element = elements[i] as HTMLElement;
  //     element.style.display = "none";
  //   }
  return (
    <div>
      <Select
        options={users.map((user: IUser) => ({
          label: user.name,
          value: user.id,
        }))}
        styles={customStyles}
        onChange={handleSelectUser}
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
