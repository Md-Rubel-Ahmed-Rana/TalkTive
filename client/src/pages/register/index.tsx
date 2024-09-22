import React, { ReactElement } from "react";
import GetHead from "@/utils/Head";
import RegisterPage from "@/components/register";
import { description } from "@/components/common/Welcome";
import RootLayout from "@/layout";

const Register = () => {
  return (
    <>
      <GetHead
        title="Register - TalkTive"
        description={description}
        keywords="talktive, message, audio, video"
      />
      <RegisterPage />
    </>
  );
};

Register.getLayout = function (page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};

export default Register;
