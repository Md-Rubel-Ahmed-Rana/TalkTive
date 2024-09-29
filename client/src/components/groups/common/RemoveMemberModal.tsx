import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import { Avatar, Box, Button, Fade, Modal, Typography } from "@mui/material";
import RemoveMemberButton from "./RemoveMemberButton";

type Props = {
  group: IGetChat;
  open: boolean;
  setOpen: (value: boolean) => void;
};

const RemoveMemberModal = ({ open, setOpen, group }: Props) => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Fade in={open}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[98%] lg:w-1/3 h-2/3 overflow-y-auto rounded-md bg-white shadow-lg p-4">
          <Typography component={"h2"} variant="h6">
            Remove Member
          </Typography>
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
        </Box>
      </Fade>
    </Modal>
  );
};

export default RemoveMemberModal;
