import Register from "@/auth/register";
import PageMetadata from "@/common/PageMetadata";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IUser } from "@/types/user";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RegisterPage = () => {
  const router = useRouter();
  const { data, isLoading } = useGetLoggedInUserQuery({});
  const user = data?.data as IUser | undefined;

  useEffect(() => {
    if (!isLoading && user?._id) {
      router.replace("/");
    }
  }, [isLoading, user?._id, router]);

  return (
    <>
      <PageMetadata
        title="Create Account"
        description="TalkTive registration page"
        keywords="register, create account, talktive"
      />
      {!isLoading && !user?._id && <Register />}
    </>
  );
};

export default RegisterPage;
