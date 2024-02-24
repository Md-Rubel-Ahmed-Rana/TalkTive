import apiSlice from "../api/apiSlice";
import Cookies from "js-cookie";

const fileUploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadMultipleImage: builder.mutation({
      query: (images) => ({
        headers: {
          authorization: Cookies.get("tmAccessToken"),
        },
        url: "/cloudinary/multiple-image",
        method: "POST",
        body: images,
      }),
    }),

    uploadMultipleFile: builder.mutation({
      query: (files) => ({
        headers: {
          authorization: Cookies.get("tmAccessToken"),
        },
        url: "/cloudinary/multiple-files",
        method: "POST",
        body: files,
      }),
    }),
  }),
});

export const { useUploadMultipleFileMutation, useUploadMultipleImageMutation } =
  fileUploadApi;
