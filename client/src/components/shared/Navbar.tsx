import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import { Button } from "@mui/material";
import LogoutButton from "./LogoutButton";

const settings = [
  { name: "Profile", url: "/user/profile" },
  { name: "Inbox", url: "inbox" },
  { name: "Friends", url: "/user/friends" },
  { name: "Settings", url: "/user/settings" },
];

const addParamsToPath = (url: string): string => {
  return url;
};

const Navbar = () => {
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" className="bg-blue-600 w-full">
      <Container maxWidth={false} className="px-4">
        <Toolbar disableGutters className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar
              alt="Logo"
              src="https://res.cloudinary.com/dy4qhabxk/image/upload/v1726682979/chat_favicon_fjgl8w.png"
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              className="ml-2  text-white font-mono font-bold text-xl tracking-widest"
            >
              Talktive
            </Typography>
          </div>

          {user?.id ? (
            <Box className="flex-grow-0">
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} className="p-0">
                  <Avatar
                    alt="User Avatar"
                    src={
                      user?.image || "https://i.ibb.co/1MqspsL/user-Avater.png"
                    }
                  />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                className="mt-11"
              >
                {settings.map((setting) => (
                  <Link
                    key={setting?.name}
                    href={`/${addParamsToPath(
                      `${setting?.url}/${user?.id}?userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`
                    )}`}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography className="text-center">
                        {setting?.name}
                      </Typography>
                    </MenuItem>
                  </Link>
                ))}
                <Button>
                  <LogoutButton />
                </Button>
              </Menu>
            </Box>
          ) : (
            <div className="flex gap-2 items-center">
              <Link
                className="bg-transparent border-2 border-blue-400 px-3 py-1 rounded-md"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="bg-transparent border-2 border-blue-400 px-3 py-1 rounded-md"
                href="/register"
              >
                Register
              </Link>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
