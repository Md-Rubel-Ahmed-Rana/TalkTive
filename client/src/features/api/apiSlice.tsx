import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5050",
    credentials: "include",
  }),
  tagTypes: ["user", "message", "chat"] as any,
  endpoints: () => ({}),
});

export default apiSlice;
