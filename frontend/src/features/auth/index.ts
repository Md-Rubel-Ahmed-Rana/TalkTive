import { ILogin } from "@/auth/login-form";
import { IRegister } from "@/auth/register-form";
import apiSlice from "@/redux/apiSlice";
import { IUser } from "@/types/user";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoggedInUser: builder.query({
      query: () => ({
        method: "GET",
        url: "/auth",
      }),
      providesTags: ["user"],
    }),
    loginUser: builder.mutation({
      query: (data: ILogin) => ({
        method: "POST",
        url: "/auth/login",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    registerUser: builder.mutation({
      query: (data: IRegister) => ({
        method: "POST",
        url: `/auth/register`,
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    // user logout endpoint can be added here in the future
    userLogout: builder.mutation({
      query: () => ({
        method: "DELETE",
        url: "/auth/logout",
      }),
      invalidatesTags: ["user"],
    }),
    updateProfileImage: builder.mutation({
      query: (data: FormData) => ({
        method: "PATCH",
        url: `/auth/profile-image`,
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    updateUserPassword: builder.mutation({
      query: (data: { currentPassword: string; newPassword: string }) => ({
        method: "PATCH",
        url: `/auth/password`,
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (data: Partial<IUser>) => ({
        method: "PATCH",
        url: `/auth`,
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    changeUserPassword: builder.mutation({
      query: (data: { oldPassword: string; newPassword: string }) => ({
        method: "PATCH",
        url: `/auth/change-password`,
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetLoggedInUserQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useUserLogoutMutation,
  useUpdateProfileImageMutation,
  useUpdateUserPasswordMutation,
  useUpdateUserMutation,
  useChangeUserPasswordMutation,
} = authApi;
