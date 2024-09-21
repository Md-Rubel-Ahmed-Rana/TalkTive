import { IMessage } from "@/interfaces/message.interface";
import apiSlice from "../api/apiSlice";

const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({
        sender,
        receiver,
        data,
      }: {
        sender: string;
        receiver: string;
        data: IMessage;
      }) => ({
        url: `/message/send/${sender}/${receiver}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["message", "chat"] as any,
    }),
    getMessagesByChatId: builder.query({
      query: (chatId: string) => ({
        url: `/message/${chatId}`,
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
      query: ({ id, content }: { id: string; content: string }) => ({
        url: `/message/update/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["message"] as any,
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesByChatIdQuery,
  useDeleteMessageMutation,
  useEditMessageMutation,
} = messageApi;
