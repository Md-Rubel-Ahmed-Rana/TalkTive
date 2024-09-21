import { useGetUsersQuery } from "@/features/user";
import { IGetUser } from "@/interfaces/user.interface";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { GoSearch } from "react-icons/go";
import {
  TextField,
  MenuItem,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";

const SearchUserList = () => {
  const { data } = useGetUsersQuery([]);
  const users = data?.data as IGetUser[];
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const router = useRouter();

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const lowercasedFilter = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user?.name?.toLowerCase().includes(lowercasedFilter) ||
        user?.email?.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, users]);

  const handleSelectUser = (user: IGetUser) => {
    setSearchTerm("");
    setOpenDropdown(false);
    router.push(
      `/chats/messages//${user?.id}?participantId=${user?.id}&name=${user?.name}&email=${user?.email}&profile_picture=${user?.image}`
    );
  };

  return (
    <div className="relative my-2 mx-1">
      <TextField
        label="Search to chat..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setOpenDropdown(true);
        }}
        onFocus={() => setOpenDropdown(true)}
        onMouseLeave={() => setOpenDropdown(false)}
        InputProps={{
          endAdornment: <GoSearch className="text-gray-400" />,
        }}
      />

      {openDropdown && (
        <div className="absolute z-10 bg-gray-400 w-full max-h-64 overflow-auto border mt-1">
          {filteredUsers?.map((user) => (
            <MenuItem
              key={user.id}
              onClick={() => handleSelectUser(user)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <ListItem disableGutters>
                <ListItemAvatar>
                  {user?.image ? (
                    <Avatar src={user?.image as string} />
                  ) : (
                    <Avatar>{user?.name?.slice(0, 1).toUpperCase()}</Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText primary={user?.name} secondary={user?.title} />
              </ListItem>
            </MenuItem>
          ))}
          {filteredUsers?.length === 0 && (
            <MenuItem disabled>No users found</MenuItem>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUserList;
