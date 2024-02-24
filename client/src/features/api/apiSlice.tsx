import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5050",
    headers: {
      authorization: Cookies.get("talktiveAccessToken") as string,
    },
  }),
  tagTypes: ["user", "message"] as any,
  endpoints: () => ({}),
});

export default apiSlice;
