import Register from "@/auth/register";
import PageMetadata from "@/common/PageMetadata";

const RegisterPage = () => {
  return (
    <>
      <PageMetadata
        title="Create Account"
        description="TalkTive registration page"
        keywords="register, create account, talktive"
      />
      <Register />
    </>
  );
};

export default RegisterPage;
