import Login from "@/auth/login";
import PageMetadata from "@/common/PageMetadata";

const LoginPage = () => {
  return (
    <>
      <PageMetadata
        title="Login | Talktive"
        description="Welcome to Talktive - Your Ultimate Communication Solution!"
        keywords="Talktive, Home"
      />
      <Login />
    </>
  );
};

export default LoginPage;
