import { useLogoutMutation } from "@/features/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
const LogoutButton = () => {
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const result: any = await logout({});
      if (result?.data?.statusCode === 200) {
        toast.success(result?.data?.message || "User logged out!");
        router.push("/");
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
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 font-semibold"
    >
      <LogoutIcon />
      <small className="hidden lg:block">Logout</small>
    </button>
  );
};

export default LogoutButton;
