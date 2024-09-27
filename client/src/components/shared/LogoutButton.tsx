import { useLogoutMutation } from "@/features/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
const LogoutButton = () => {
  const [logout] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      const result: any = await logout({});
      if (result?.data?.statusCode === 200) {
        toast.success(result?.data?.message || "User logged out!");
        window.location.replace("/");
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to logout. Try again!"
        );
      }
    } catch (error) {
      toast.error("Failed to logout. Try again!");
    }
  };
  return (
    <Button
      variant="text"
      onClick={handleLogout}
      className="flex items-center justify-start gap-2 font-semibold w-full"
    >
      <LogoutIcon />
      <small>Logout</small>
    </Button>
  );
};

export default LogoutButton;
