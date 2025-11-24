import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const handleGoogleLogin = () => {
  toast.info("Google login is not implemented yet.");
};

const GoogleLogin = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 my-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="flex items-center justify-center gap-2 h-12 text-sm w-full bg-white/90 backdrop-blur-xl hover:bg-white/80"
        onClick={handleGoogleLogin}
      >
        <FcGoogle size={24} />
        Continue with Google
      </Button>
    </div>
  );
};

export default GoogleLogin;
