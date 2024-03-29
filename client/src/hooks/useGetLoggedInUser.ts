import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { IUser, userInitData } from "@/interfaces/user.interface";

const useGetLoggedInUser = () => {
  const [user, setUser] = useState<IUser>(userInitData);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("talktiveAccessToken");
        if (token) {
          const res = await fetch("http://localhost:5050/user/auth", {
            headers: {
              authorization: token,
            },
          });
          const data = await res.json();
          setUser(data?.data);
        }
      } catch (error) {
        console.log("Failed to fetch user");
      }
    };
    fetchUser();
  }, []);

  return user;
};

export default useGetLoggedInUser;
