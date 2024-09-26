import GroupActions from "@/components/messages/group/GroupActions";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { useGetSingleChatQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import { Typography, Avatar, Paper, Box, Divider, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import AddGroupMemberModal from "../common/AddGroupMemberModal";
import RemoveMemberButton from "../common/RemoveMemberButton";

const GroupDetails = () => {
  const { query } = useRouter();
  const chatId = query?.id as string;
  const { data, isLoading } = useGetSingleChatQuery(chatId);
  const group = data?.data as IGetChat;
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const [isAddMember, setIsAddMember] = useState(false);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box className="p-2 lg:p-4 max-w-2xl mx-auto">
        <Paper elevation={3} className="p-6 rounded-lg shadow-lg bg-white">
          <Box className="flex gap-2">
            <Box className="flex flex-col justify-center items-center gap-2">
              <Avatar
                src={group?.groupImage}
                alt={group?.groupName}
                className="w-24 h-24 mx-auto"
              />
              <Typography variant="body2" className="text-gray-600">
                <Typography variant="body2" className="text-gray-600">
                  Created at:
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {new Date(group?.createdAt).toLocaleDateString()}
                </Typography>
              </Typography>
            </Box>
            <Box className="w-full">
              <Box className="flex justify-between w-full">
                <Typography variant="h5" className="font-bold">
                  {group?.groupName}
                </Typography>
                <GroupActions chatId={group?.id} isButton={true} />
              </Box>
              <Typography variant="subtitle1">
                {group?.groupDescription}
              </Typography>
            </Box>
          </Box>
          <Divider className="my-4" />
          <Box className="flex items-center gap-2 mt-4">
            <Typography variant="h6" className="font-semibold">
              Members:
            </Typography>
            <Button
              onClick={() => setIsAddMember(true)}
              size="small"
              variant="outlined"
            >
              Add Member
            </Button>
          </Box>
          <Box className="flex flex-col gap-5">
            {group?.participants?.map((participant) => (
              <Box
                key={participant?.id}
                className="px-2 py-3 flex justify-between items-center shadow-md"
              >
                <Box className="flex justify-between items-center gap-2 w-full">
                  <Box className="flex justify-between items-center gap-2">
                    <Avatar
                      className="h-14 w-14 rounded-full ring-2"
                      src={participant?.image}
                      alt={participant?.name}
                    />
                    <Typography className="text-lg">
                      {participant?.name}
                    </Typography>
                  </Box>
                  {group?.admin?.id === participant?.id && (
                    <Button variant="outlined">Admin</Button>
                  )}
                </Box>
                {group?.admin?.id !== participant?.id &&
                  user?.id === group?.admin?.id && (
                    <RemoveMemberButton
                      chatId={group?.id}
                      memberId={participant?.id}
                      btnText="Remove"
                    />
                  )}
              </Box>
            ))}
          </Box>
          <Divider className="my-10" />
          <Box>
            <Typography variant="h6" className="font-semibold">
              Group Rules:
            </Typography>
            <Box component={"ul"} className="list-disc ml-6">
              {group?.groupRules?.map((rule, index) => (
                <Typography key={index} className="" component={"li"}>
                  {rule}
                </Typography>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
      <AddGroupMemberModal
        groupId={group?.id}
        groupName={group?.groupName}
        open={isAddMember}
        setOpen={setIsAddMember}
      />
    </>
  );
};

export default GroupDetails;
