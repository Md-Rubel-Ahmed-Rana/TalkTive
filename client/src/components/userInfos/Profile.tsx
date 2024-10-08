import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import Link from "next/link";
import UpdateUserInfo from "./UpdateUserInfo";
import { useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useRouter } from "next/router";
import { useGetSingleUserInfoQuery } from "@/features/user";
import ProfilePictureChange from "./ProfilePictureChange";
import ProfileSkeleton from "../skeletons/ProfileSkeleton";

const Profile = () => {
  const { query } = useRouter();
  const userId = query?.id as string;
  const { data: userData1 } = useGetLoggedInUserQuery({});
  const currentUser = userData1?.data as IGetUser;
  const { data: userData2, isLoading } = useGetSingleUserInfoQuery(userId);
  const user = userData2?.data as IGetUser;
  const [isEditInfo, setIsEditInfo] = useState(false);
  const [isChangeImage, setIsChangeImage] = useState(false);

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <>
          <Box className="h-screen bg-gray-100 px-2 lg:px-4 py-10 lg:py-20">
            <Card className="w-full max-w-4xl mx-auto  bg-white shadow-lg rounded-lg overflow-hidden">
              <Box className="flex flex-col justify-center md:flex-row items-center p-4 md:p-6">
                <Box className="relative">
                  <Avatar
                    alt={user?.name}
                    src={user?.image}
                    className="w-32 h-32 md:w-48 md:h-48 shadow-lg"
                  />
                  {currentUser?.id === user?.id && (
                    <CameraAltIcon
                      onClick={() => setIsChangeImage(true)}
                      titleAccess="Change profile picture"
                      className="absolute text-2xl -bottom-4 left-1/2 bg-gray-500 w-10 p-2 rounded-full text-white cursor-pointer h-10 transform -translate-x-1/2 -translate-y-1/2"
                    />
                  )}
                </Box>
                <Box className="md:ml-6 flex-1 w-full mt-4 md:mt-0 text-center md:text-left">
                  <Box className="flex justify-center lg:justify-between items-center mb-4">
                    <Typography
                      variant="h5"
                      component="h2"
                      className="font-bold text-lg lg:text-2xl"
                    >
                      {user?.name}
                    </Typography>
                    {currentUser?.id === user?.id && (
                      <Tooltip title="Edit Profile">
                        <IconButton
                          onClick={() => setIsEditInfo(true)}
                          aria-label="edit profile"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <Typography
                    variant="body1"
                    color="textSecondary"
                    className="text-sm md:text-base"
                  >
                    {user?.title || "No title"}
                  </Typography>

                  <Typography variant="body2" className="text-gray-500 mt-2">
                    {user?.about || "No about"}
                  </Typography>

                  <Divider className="my-4" />

                  <Box className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    {user?.links?.map((link, index) => (
                      <Box key={index} className="flex items-center space-x-2">
                        <Link
                          href={link?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:underline"
                        >
                          <LinkIcon />
                          <Typography>{link?.name}</Typography>
                        </Link>
                        {index !== user?.links?.length - 1 && (
                          <Box component={"span"} className="text-gray-400">
                            |
                          </Box>
                        )}
                      </Box>
                    ))}
                    {user?.links?.length <= 0 && (
                      <Typography>No links</Typography>
                    )}
                  </Box>

                  <Divider className="my-4" />

                  <Typography variant="caption" color="textSecondary">
                    Last active: {new Date(user?.lastActive).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <CardContent className="bg-gray-50">
                <Typography variant="caption" color="textSecondary">
                  Member since: {new Date(user?.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <UpdateUserInfo open={isEditInfo} setOpen={setIsEditInfo} />
          <ProfilePictureChange
            open={isChangeImage}
            setOpen={setIsChangeImage}
          />
        </>
      )}
    </>
  );
};

export default Profile;
