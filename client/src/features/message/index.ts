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
        data: IMessage | FormData;
      }) => ({
        url: `/message/send/${sender}/${receiver}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["message", "chat"] as any,
    }),
    getMessagesByChatId: builder.query({
      query: ({
        chatId,
        participantId,
      }: {
        chatId: string;
        participantId: string;
      }) => ({
        url: `/message/${chatId}/${participantId}`,
      }),
      providesTags: ["message"] as any,
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/message/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["message", "chat"] as any,
    }),
    editMessage: builder.mutation({
      query: ({ id, content }: { id: string; content: string }) => ({
        url: `/message/update/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["message"] as any,
    }),
    readMessages: builder.mutation({
      query: ({
        chatId,
        participantId,
      }: {
        chatId: string;
        participantId: string;
      }) => ({
        method: "PATCH",
        url: `/message/read/${chatId}/${participantId}`,
      }),
      invalidatesTags: ["message", "chat"] as any,
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesByChatIdQuery,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useReadMessagesMutation,
} = messageApi;
