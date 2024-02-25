import apiSlice from "../api/apiSlice";

const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/message/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["message"] as any,
    }),

    getMessages: builder.query({
      query: ({ sender, receiver }) => ({
        url: `/message/${sender}/${receiver}`,
      }),
      providesTags: ["message"] as any,
    }),

    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/message/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["message"] as any,
    }),

    editMessage: builder.mutation({
      query: ({ id, text }) => ({
        url: `/message/update/${id}`,
        method: "PATCH",
        body: { text },
      }),
      invalidatesTags: ["message"] as any,
    }),
  }),
});

export const {
  useSendMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useGetMessagesQuery,
} = messageApi;
