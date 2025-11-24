import { ILogin } from "@/auth/login-form";
import { IRegister } from "@/auth/register-form";
import apiSlice from "@/redux/apiSlice";

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
  }),
});

export const {
  useGetLoggedInUserQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
} = authApi;
