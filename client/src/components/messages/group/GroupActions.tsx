import AddGroupMemberModal from "@/components/groups/common/AddGroupMemberModal";
import DeleteGroupButton from "@/components/groups/common/DeleteGroupButton";
import GroupImageChange from "@/components/groups/common/GroupImageChange";
import RemoveMemberModal from "@/components/groups/common/RemoveMemberModal";
import BackNavigationButton from "@/components/shared/BackNavigationButton";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { useGetSingleChatQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { Button, Popover, Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import LeaveGroupButton from "../../groups/common/LeaveGroupButton";
import ClearChatButton from "../../chatList/ClearChatButton";
import RestoreClearChatButton from "../../chatList/RestoreClearChatButton";
import DeleteChatButton from "../../chatList/DeleteChatButton";
import { AudioCall, VideoCall } from "@/components/calls";

type Props = {
  isButton?: boolean;
  chatId: string;
};

const GroupActions = ({ isButton, chatId }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { push } = useRouter();
  const { data } = useGetSingleChatQuery(chatId);
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const chat = data?.data as IGetChat;
  const [isAddMember, setIsAddMember] = useState(false);
  const [isRemoveMember, setIsRemoveMember] = useState(false);
  const [isChangeImage, setIsChangeImage] = useState(false);

  const handleOpen = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateGroupDetails = () => {
    const groupDetailsLink = `/groups/${chat?.id}?groupId=${
      chat?.id
    }&groupName=${chat?.groupName}&groupImage=${chat?.groupImage || ""}`;
    push(groupDetailsLink);
    handleClose();
  };

  const handleAddMember = () => {
    setIsAddMember(true);
    handleClose();
  };

  const handleRemoveMember = () => {
    setIsRemoveMember(true);
    handleClose();
  };

  const handleNavigateGroupEditPage = () => {
    const groupDetailsLink = `/groups/edit/${chat?.id}?groupId=${
      chat?.id
    }&groupName=${chat?.groupName}&groupImage=${chat?.groupImage || ""}`;
    push(groupDetailsLink);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {isButton ? (
        <Button
          className="cursor-pointer"
          title="Chat actions"
          aria-describedby={chatId}
          onClick={handleOpen}
          variant="outlined"
        >
          <MoreVertOutlinedIcon />
        </Button>
      ) : (
        <MoreVertOutlinedIcon
          className="cursor-pointer"
          titleAccess="Chat actions"
          aria-describedby={chatId}
          onClick={handleOpen}
        />
      )}

      <Popover
        id={chatId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            padding: "16px",
            maxWidth: "300px",
            marginTop: "14px",
          },
        }}
      >
        <Box className="flex flex-col gap-2 w-full">
          <Box className="block lg:hidden">
            <Box className="flex justify-between gap-1 mb-2">
              <AudioCall />
              <VideoCall />
            </Box>
            <BackNavigationButton />
          </Box>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleNavigateGroupDetails}
          >
            Group Details
          </Button>
          <ClearChatButton
            chat={chat}
            options={{ closeDropdown: handleClose }}
          />
          <RestoreClearChatButton
            chat={chat}
            options={{ closeDropdown: handleClose }}
          />
          <DeleteChatButton
            chat={chat}
            options={{ closeDropdown: handleClose }}
          />
          {chat?.admin?.id === user?.id ? (
            <>
              <Button onClick={handleAddMember} variant="outlined" fullWidth>
                Add member
              </Button>
              <Button onClick={handleRemoveMember} variant="outlined" fullWidth>
                Remove member
              </Button>
              <Button
                onClick={handleNavigateGroupEditPage}
                variant="outlined"
                fullWidth
              >
                Edit group
              </Button>
              <Button
                onClick={() => {
                  setIsChangeImage(true);
                  handleClose();
                }}
                variant="outlined"
                fullWidth
              >
                Change image
              </Button>
              <DeleteGroupButton btnText="Delete Group" groupId={chat?.id} />
            </>
          ) : (
            <>
              <LeaveGroupButton chatId={chat?.id} />
            </>
          )}
        </Box>
      </Popover>

      {/* add new member to group/chat modal  */}
      <AddGroupMemberModal
        groupId={chat?.id}
        groupName={chat?.groupName}
        open={isAddMember}
        setOpen={setIsAddMember}
      />

      {/* remove member from group/chat modal  */}
      <RemoveMemberModal
        group={chat}
        open={isRemoveMember}
        setOpen={setIsRemoveMember}
      />
      <GroupImageChange
        chatId={chat?.id}
        open={isChangeImage}
        setOpen={setIsChangeImage}
      />
    </>
  );
};

export default GroupActions;
