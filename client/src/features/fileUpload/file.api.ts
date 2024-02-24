import apiSlice from "../api/apiSlice";

const fileUploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadMultipleImage: builder.mutation({
      query: (images) => ({
        url: "/cloudinary/multiple-image",
        method: "POST",
        body: images,
      }),
    }),

    uploadMultipleFile: builder.mutation({
      query: (files) => ({
        url: "/cloudinary/multiple-files",
        method: "POST",
        body: files,
      }),
    }),
  }),
});

export const { useUploadMultipleFileMutation, useUploadMultipleImageMutation } =
  fileUploadApi;
