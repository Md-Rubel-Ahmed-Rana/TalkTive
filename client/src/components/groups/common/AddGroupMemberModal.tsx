import { useGetUsersExceptExistingParticipantsQuery } from "@/features/user";
import { IGetUser } from "@/interfaces/user.interface";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fade,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import useHandlePropagation from "@/hooks/useHandlePropagation";
import { useAddNewMemberMutation } from "@/features/chat";
import toast from "react-hot-toast";

type Props = {
  groupId: string;
  groupName: string;
  open: boolean;
  setOpen: (value: boolean) => void;
};

const AddGroupMemberModal = ({ groupId, groupName, open, setOpen }: Props) => {
  const { data, isLoading } =
    useGetUsersExceptExistingParticipantsQuery(groupId);
  const users = data?.data as IGetUser[];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<IGetUser | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const closeDropDown = useHandlePropagation();
  const dropdownRef = useRef(null);
  const [addMember, { isLoading: isMemberAdding }] = useAddNewMemberMutation();

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const lowercasedFilter = searchTerm.toLowerCase();
    return users?.filter(
      (user: IGetUser) =>
        user?.name?.toLowerCase().includes(lowercasedFilter) ||
        user?.email?.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, users]);

  const handleSelectUser = (user: IGetUser) => {
    setSelectedUser(user);
    setOpenDropdown(false);
    console.log(user);
  };

  const handleAddMember = async () => {
    try {
      const result: any = await addMember({
        chatId: groupId,
        participantId: selectedUser?.id as string,
      });
      if (result?.data?.statusCode === 200) {
        toast.success(result?.data?.message || "Group member added");
        handleClose();
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to add member"
        );
        handleClose();
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to add member. Try again!");
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setOpenDropdown(false);
  };

  useEffect(() => {
    closeDropDown(dropdownRef, setOpenDropdown);
  }, [closeDropDown, setOpenDropdown]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Fade in={open}>
        <Box className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[98%] lg:w-1/3 rounded-md bg-white shadow-lg p-4">
          <Typography component={"h2"} variant="h6">
            Add New Member
          </Typography>
          <Typography className="font-semibold">Group: {groupName}</Typography>
          {isLoading ? (
            <Box className="w-full text-center">
              <Typography>Loading users...</Typography>
            </Box>
          ) : (
            <Box className="my-2 w-[97%] mx-auto relative">
              {!isMemberAdding && (
                <TextField
                  label="Search user..."
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setOpenDropdown((prev) => !prev);
                    setSelectedUser(null);
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: <SearchIcon className="text-gray-400" />,
                  }}
                />
              )}

              {selectedUser && (
                <Box className="border mt-3 rounded-md p-2">
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      {selectedUser?.image ? (
                        <Avatar src={selectedUser?.image as string} />
                      ) : (
                        <Avatar>
                          {selectedUser?.name?.slice(0, 1).toUpperCase()}
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={selectedUser?.name}
                      secondary={selectedUser?.email}
                    />
                  </ListItem>
                  <Button
                    variant="contained"
                    className="bg-blue-600"
                    fullWidth
                    disabled={isMemberAdding}
                    onClick={handleAddMember}
                  >
                    {isMemberAdding ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Add Member"
                    )}
                  </Button>
                </Box>
              )}

              {(searchTerm || openDropdown) && (
                <div
                  ref={dropdownRef}
                  className="rounded-md border mt-2 z-50 absolute bg-white w-[98%] mx-auto"
                >
                  <div className="max-h-[200px] h-full overflow-y-auto">
                    {filteredUsers?.map((user: IGetUser) => (
                      <MenuItem
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                      >
                        <ListItem disableGutters>
                          <ListItemAvatar>
                            {user?.image ? (
                              <Avatar src={user?.image as string} />
                            ) : (
                              <Avatar>
                                {user?.name?.slice(0, 1).toUpperCase()}
                              </Avatar>
                            )}
                          </ListItemAvatar>
                          <ListItemText
                            primary={user?.name}
                            secondary={user?.email}
                          />
                        </ListItem>
                      </MenuItem>
                    ))}
                    {filteredUsers?.length === 0 && (
                      <MenuItem disabled>No users found</MenuItem>
                    )}
                  </div>
                </div>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddGroupMemberModal;
