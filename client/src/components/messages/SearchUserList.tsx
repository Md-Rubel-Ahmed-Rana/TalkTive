import { useGetUsersQuery } from "@/features/user";
import { IGetUser } from "@/interfaces/user.interface";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import {
  TextField,
  MenuItem,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import useHandlePropagation from "@/hooks/useHandlePropagation";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { useLazyGetChatByTwoParticipantsQuery } from "@/features/chat";

const SearchUserList = () => {
  const { data } = useGetUsersQuery([]);
  const { data: userData } = useGetLoggedInUserQuery({});
  const [getChatByTwoParticipants] = useLazyGetChatByTwoParticipantsQuery();
  const currentUser = userData?.data as IGetUser;
  const users =
    data?.data &&
    (data?.data?.filter(
      (user: IGetUser) => user?.id !== currentUser?.id
    ) as IGetUser[]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeDropDown = useHandlePropagation();

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const lowercasedFilter = searchTerm.toLowerCase();
    return users.filter(
      (user: IGetUser) =>
        user?.name?.toLowerCase().includes(lowercasedFilter) ||
        user?.email?.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, users]);

  const handleSelectUser = async (user: IGetUser) => {
    setSearchTerm("");
    setOpen(false);

    const { data: chatData } = await getChatByTwoParticipants({
      participant1: currentUser?.id,
      participant2: user?.id,
    });

    const chatId = chatData?.data?.id;
    let path = "";

    if (chatId) {
      path = `/inbox/messages/chat/p2p?chatId=${chatId}&userId=${user?.id}&userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;
    } else {
      path = `/inbox/messages/chat/p2p?userId=${user?.id}&userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;
    }

    router.push(path);
  };

  useEffect(() => {
    closeDropDown(dropdownRef, setOpen);
  }, [closeDropDown]);

  return (
    <div className="my-2 w-[97%] mx-auto relative">
      <TextField
        label="Search user..."
        variant="outlined"
        fullWidth
        onFocus={() => setOpen(true)}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: <SearchIcon className="text-gray-400" />,
        }}
      />

      {(searchTerm || open) && (
        <div
          ref={dropdownRef}
          className="rounded-md border mt-2 z-50 absolute bg-white w-[98%] mx-auto"
        >
          <div className="max-h-[400px] h-full overflow-y-auto">
            {filteredUsers?.map((user: IGetUser) => (
              <MenuItem key={user.id} onClick={() => handleSelectUser(user)}>
                <ListItem disableGutters>
                  <ListItemAvatar>
                    {user?.image ? (
                      <Avatar src={user?.image as string} />
                    ) : (
                      <Avatar>{user?.name?.slice(0, 1).toUpperCase()}</Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText primary={user?.name} secondary={user?.email} />
                </ListItem>
              </MenuItem>
            ))}
            {filteredUsers?.length === 0 && (
              <MenuItem disabled>No users found</MenuItem>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUserList;
