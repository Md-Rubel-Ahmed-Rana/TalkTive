import PageMetadata from "@/common/PageMetadata";
import Profile from "@/profile";
import React from "react";

const ProfilePage = () => {
  return (
    <>
      <PageMetadata
        title="Profile"
        description="User profile page"
        keywords="Profile"
      />
      <Profile />
    </>
  );
};

export default ProfilePage;
