import { description } from "@/components/common/Welcome";
import LoginPage from "@/components/login";
import RootLayout from "@/layout";
import GetHead from "@/utils/Head";
import React, { ReactElement } from "react";

const Login = () => {
  return (
    <>
      <GetHead
        title="Login - TalkTive"
        description={description}
        keywords="talktive, message, audio, video"
      />
      <LoginPage />
    </>
  );
};

Login.getLayout = function (page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};

export default Login;
