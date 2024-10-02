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
import GroupDetailSkeleton from "@/components/skeletons/GroupDetailSkeleton";

const GroupDetails = () => {
  const { query } = useRouter();
  const chatId = query?.id as string;
  const { data, isLoading } = useGetSingleChatQuery(chatId);
  const group = data?.data as IGetChat;
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const [isAddMember, setIsAddMember] = useState(false);

  return (
    <>
      {isLoading ? (
        <GroupDetailSkeleton />
      ) : (
        <Box className="p-2 lg:p-4 max-w-2xl mx-auto bg-white lg:bg-inherit">
          <Box className="lg:p-6 lg:rounded-lg border-0 lg:shadow-lg bg-white">
            <Box className="flex flex-col lg:flex-row gap-2">
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
                <Box className="flex justify-between items-center w-full my-4 lg:my-0">
                  <Typography className="font-bold text- lg:text-xl">
                    {group?.groupName}
                  </Typography>
                  <Box className="hidden lg:block">
                    <GroupActions chatId={group?.id} isButton={true} />
                  </Box>
                  <Box className="lg:hidden block">
                    <GroupActions chatId={group?.id} />
                  </Box>
                </Box>
                <Typography variant="subtitle1">
                  {group?.groupDescription || "No group description"}
                </Typography>
              </Box>
            </Box>
            <Divider className="my-4" />
            <Box className="flex items-center gap-2 mt-4">
              <Typography variant="h6" className="font-semibold">
                Members:
              </Typography>
              {user?.id === group?.admin?.id && (
                <Button
                  onClick={() => setIsAddMember(true)}
                  size="small"
                  variant="outlined"
                >
                  Add Member
                </Button>
              )}
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
                        className="h-10 lg:h-14 w-10 lg:w-14 rounded-full ring-2"
                        src={participant?.image}
                        alt={participant?.name}
                      />
                      <Box component={"div"}>
                        <Typography className="text-sm lg:text-lg">
                          {participant?.name}
                        </Typography>
                        <Typography variant="body2">
                          {participant?.email}
                        </Typography>
                      </Box>
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
              {group?.groupRules?.length > 0 ? (
                <Box component={"ul"} className="list-disc ml-6">
                  {group?.groupRules?.map((rule, index) => (
                    <Typography key={index} className="" component={"li"}>
                      {rule}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography>No group rules</Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

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
