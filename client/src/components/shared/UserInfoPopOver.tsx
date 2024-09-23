import { IGetUser } from "@/interfaces/user.interface";
import { formatLastActive } from "@/utils/lastSeenFormatter";
import {
  Popover,
  Typography,
  Avatar,
  Box,
  Link as MUILink,
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
          <Typography variant="h6" fontWeight="bold">
            {user?.name}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {user?.title || "No title provided"}
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" color="textSecondary" mb={2}>
        {user?.about || "No additional information available."}
      </Typography>

      <Divider sx={{ my: 1 }} />

      <Typography variant="caption" color="textSecondary" mb={1}>
        {formatLastActive(user?.lastActive)}
      </Typography>

      <Divider sx={{ my: 1 }} />

      {user?.links?.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Links
          </Typography>
          {user?.links?.map((link, index) => (
            <MUILink
              key={index}
              href={link?.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              display="block"
              mb={0.5}
            >
              {link?.name}
            </MUILink>
          ))}
        </Box>
      )}

      <div className="flex justify-between gap-2 w-full">
        <Link href={`/user/profile/${user.id}`} className="w-full">
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
