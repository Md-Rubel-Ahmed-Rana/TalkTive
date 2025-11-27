import apiSlice from "@/redux/apiSlice";

const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        method: "GET",
        url: "/users",
      }),
      providesTags: ["user"],
    }),
    getUserById: builder.query({
      query: ({ id }: { id: string }) => ({
        method: "GET",
        url: `/users/${id}`,
      }),
      providesTags: ["user"],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetUserByIdQuery } = usersApi;
