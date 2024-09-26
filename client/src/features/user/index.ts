import { IUser } from "@/interfaces/user.interface";
import apiSlice from "../api/apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (user) => ({
        method: "POST",
        url: "/user/register",
        body: user,
      }),
      invalidatesTags: ["user"] as any,
    }),
    getUsers: builder.query({
      query: () => ({
        url: "/user",
      }),
      providesTags: ["user"] as any,
    }),
    getUsersExceptExistingParticipants: builder.query({
      query: (chatId: string) => ({
        url: `/user/search-user/${chatId}`,
      }),
      providesTags: ["user"] as any,
    }),
    getSingleUserInfo: builder.query({
      query: (id: string) => ({
        url: `/user/${id}`,
      }),
      providesTags: ["user"] as any,
    }),
    updateUserInfo: builder.mutation({
      query: ({ id, data }: { id: string; data: Partial<IUser> }) => ({
        method: "PATCH",
        url: `/user/update-user-info/${id}`,
        body: data,
      }),
      invalidatesTags: ["user"] as any,
    }),
    changeProfilePicture: builder.mutation({
      query: ({ id, image }: { id: string; image: FormData }) => ({
        method: "PATCH",
        url: `/user/change-profile-picture/${id}`,
        body: image,
      }),
      invalidatesTags: ["user"] as any,
    }),
    changePassword: builder.mutation({
      query: ({ id, password }: { id: string; password: string }) => ({
        method: "PATCH",
        url: `/user/change-password/${id}`,
        body: { password },
      }),
      invalidatesTags: ["user"] as any,
    }),
  }),
});

export const {
  useRegisterMutation,
  useGetUsersQuery,
  useGetSingleUserInfoQuery,
  useUpdateUserInfoMutation,
  useChangeProfilePictureMutation,
  useChangePasswordMutation,
  useGetUsersExceptExistingParticipantsQuery,
} = userApi;
