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
  }),
});

export const { useGetAllUsersQuery } = usersApi;
