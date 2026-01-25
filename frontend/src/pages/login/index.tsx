import Login from "@/auth/login";
import PageMetadata from "@/common/PageMetadata";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
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
        title="Login | Talktive"
        description="Welcome to Talktive - Your Ultimate Communication Solution!"
        keywords="Talktive, Home"
      />

      {!isLoading && !user?._id && <Login />}
    </>
  );
};

export default LoginPage;
