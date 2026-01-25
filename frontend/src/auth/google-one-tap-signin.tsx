import { useEffect } from "react";
import {
  initializeGoogleOneTap,
  useGetLoggedInUserQuery,
} from "@/features/auth";
import { IUser } from "@/types/user";

const GoogleOneTapSignin = () => {
  const { data, isLoading } = useGetLoggedInUserQuery({});
  const user = data?.data as IUser;

  useEffect(() => {
    if (!isLoading && !user?.id) {
      const loadGoogleOneTap = () => {
        if (window.google) {
          initializeGoogleOneTap();
        }
      };

      if (document.readyState === "complete") {
        loadGoogleOneTap();
      } else {
        window.addEventListener("load", loadGoogleOneTap);
        return () => window.removeEventListener("load", loadGoogleOneTap);
      }
    }
  }, [isLoading, user]);

  return (
    <script src="https://accounts.google.com/gsi/client" async defer></script>
  );
};

export default GoogleOneTapSignin;
