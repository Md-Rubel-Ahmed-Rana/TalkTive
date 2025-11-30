import { Button } from "@/components/ui/button";
import { baseApi } from "@/redux/apiSlice";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const api = `${baseApi}/auth/google/login`;

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      window.open(api, "_self");
    } catch {
      toast.error("Google Sign-In Error");
    } finally {
      setLoading(false);
    }
  };

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
        className="flex items-center justify-center gap-2 h-12 text-sm w-full bg-white/90 backdrop-blur-xl hover:bg-white/80 text-gray-800"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <FcGoogle size={24} />
        {loading ? "Signing in..." : "Continue with Google"}
      </Button>
    </div>
  );
};

export default GoogleLogin;
