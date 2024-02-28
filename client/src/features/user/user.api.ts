import apiSlice from "../api/apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/user/register",
        body: data,
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
