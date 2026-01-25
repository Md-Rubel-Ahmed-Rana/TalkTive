import { Button } from "@/components/ui/button";
import { useUserLogoutMutation } from "@/features/auth";
import handleAsyncMutation from "@/utils/catchReduxAsyncMutation";

const Logout = () => {
  const [userLogout, { isLoading }] = useUserLogoutMutation();
  const handleLogout = async () => {
    await handleAsyncMutation(
      userLogout,
      {},
      200,
      {
        success: "Logged out successfully",
        error: "Failed to log out",
      },
      "/"
    );
  };
  return (
    <Button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default Logout;
