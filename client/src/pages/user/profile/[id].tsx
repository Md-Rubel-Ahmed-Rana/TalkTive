import { description } from "@/components/common/Welcome";
import Profile from "@/components/userInfos/Profile";
import RootLayout from "@/layout";
import GetHead from "@/utils/Head";
import { useRouter } from "next/router";
import { ReactElement } from "react";

const ProfilePage = () => {
  const { query } = useRouter();
  const userName = query.userName as string;
  const userEmail = query.userEmail as string;
  const userImage = query.userImage as string;
  return (
    <>
      <GetHead
        title={`Profile - ${userName} - ${userEmail} - ${userImage}`}
        description={description}
        keywords="talktive, message, audio, video"
      />
      <Profile />
    </>
  );
};

export default ProfilePage;

ProfilePage.getLayout = function (page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
