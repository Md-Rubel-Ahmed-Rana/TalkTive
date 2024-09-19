import { IRegisterUser } from "@/interfaces/user.interface";
import apiSlice from "../api/apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => ({
        method: "POST",
        url: "/user/register",
        body: user,
      }),
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/user/login",
        body: data,
      }),
      invalidatesTags: ["user"] as any,
    }),

    getUsers: builder.query({
      query: () => ({
        url: "/user",
      }),
    }),
    getSortedChatUsers: builder.query({
      query: (userId) => ({
        url: `/user/sorted-users/${userId}`,
      }),
      providesTags: ["user"] as any,
    }),
    loggedInUser: builder.query({
      query: () => ({
        url: "/user/auth",
      }),
      providesTags: ["user"] as any,
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useLoginUserMutation,
  useLoggedInUserQuery,
  useGetSortedChatUsersQuery,
} = userApi;
