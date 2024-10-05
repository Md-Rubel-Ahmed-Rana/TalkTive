import { useGetLoggedInUserQuery } from "@/features/auth";
import { useMyDeletedChatListQuery } from "@/features/chat";
import { IGetChat } from "@/interfaces/chat.interface";
import { IGetUser } from "@/interfaces/user.interface";
import { Box, Fade, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeletedChatCard from "./DeletedChatCard";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const DeletedChatList = ({ open, setOpen }: Props) => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const { data: chatData } = useMyDeletedChatListQuery(user?.id);
  const chats = chatData?.data as IGetChat[];

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Fade in={open}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] lg:w-1/3 rounded-md bg-white shadow-lg p-4">
          <Box className="flex justify-between items-center gap-3 mb-5">
            <Typography variant="h6" component="h2">
              Deleted chats
            </Typography>
            <CloseIcon
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            />
          </Box>
          <Box className="flex flex-col gap-3">
            {chats?.map((chat) => (
              <DeletedChatCard chat={chat} key={chat?.id} setOpen={setOpen} />
            ))}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeletedChatList;
