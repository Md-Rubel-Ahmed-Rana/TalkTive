import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = process.env.NEXT_PUBLIC_BASE_API as string;

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseApi,
    credentials: "include",
  }),

  tagTypes: ["user", "users"],
  endpoints: () => ({}),
});

export default apiSlice;
