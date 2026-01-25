import { baseApi } from "@/redux/apiSlice";
import { useEffect, useState } from "react";

export const useThirdPartyCookieCheck = () => {
  const [cookiesWorking, setCookiesWorking] = useState<boolean | null>(null);

  const checkCookies = async () => {
    const API = `${baseApi}/auth/check-cookie`;

    const res1 = await fetch(API, { credentials: "include" });
    const data1 = await res1.json();

    if (data1.firstTime) {
      const res2 = await fetch(API, { credentials: "include" });
      const data2 = await res2.json();
      return data2.cookiesWorking;
    }

    return data1.cookiesWorking;
  };

  useEffect(() => {
    const run = async () => {
      const working = await checkCookies();
      setCookiesWorking(working);
    };

    run();
  }, []);

  return cookiesWorking;
};
