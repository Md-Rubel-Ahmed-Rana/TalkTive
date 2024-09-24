import { IGetUser } from "@/interfaces/user.interface";
import { formatLastActive } from "@/utils/lastSeenFormatter";
import {
  Popover,
  Typography,
  Avatar,
  Box,
  Divider,
  Button,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (value: HTMLElement | null) => void;
  user: IGetUser;
};

const UserInfoPopOver = ({ anchorEl, setAnchorEl, user }: Props) => {
  const { query } = useRouter();
  const chatId = query?.chatId as string;
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const chatLink = `/inbox/messages/chat/p2p?chatId=${chatId}&userId=${user?.id}&userName=${user.name}&userEmail=${user?.email}&userImage=${user?.image}`;
  const detailsLink = `/user/profile/${user?.id}?userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;

  return (
    <Popover
      id={user?.id}
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
        },
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          src={user?.image}
          alt={user?.name}
          sx={{ width: 56, height: 56, mr: 2 }}
        />
        <Box>
          <Typography className="text-lg" variant="h6" fontWeight="bold">
            {user?.name}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {user?.title || "No title provided"}
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" color="textSecondary" mb={2}>
        {user.about.length > 50
          ? `${user?.about.slice(0, 50)}...`
          : user?.about || "No additional information available."}
      </Typography>

      <Divider sx={{ my: 1 }} />

      <Typography variant="caption" color="textSecondary" mb={1}>
        {formatLastActive(user?.lastActive)}
      </Typography>

      <Divider sx={{ my: 1 }} />

      <div className="flex justify-between gap-2 w-full">
        <Link href={detailsLink} className="w-full">
          <Button variant="outlined" fullWidth>
            See Details
          </Button>
        </Link>
        <Link href={chatLink} className="w-full">
          <Button variant="outlined" fullWidth>
            Chat
          </Button>
        </Link>
      </div>
    </Popover>
  );
};

export default UserInfoPopOver;
