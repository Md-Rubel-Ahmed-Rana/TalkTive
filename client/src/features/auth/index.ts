import { ILogin } from "@/interfaces/user.interface";
import apiSlice from "../api/apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data: ILogin) => ({
        method: "POST",
        url: "/auth/login",
        body: data,
      }),
      invalidatesTags: ["user"] as any,
    }),
    getLoggedInUser: builder.query({
      query: () => ({
        url: "/auth",
      }),
      providesTags: ["user"] as any,
    }),
    logout: builder.mutation({
      query: () => ({
        method: "DELETE",
        url: "/auth/logout",
      }),
      providesTags: ["user"] as any,
    }),
  }),
});

export const { useLoginMutation, useGetLoggedInUserQuery, useLogoutMutation } =
  authApi;
