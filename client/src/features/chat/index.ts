import { IChat } from "@/interfaces/chat.interface";
import apiSlice from "../api/apiSlice";

const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewChat: builder.mutation({
      query: (data: IChat) => ({
        method: "POST",
        url: "/chat/add-new-chat",
        body: data,
      }),
      invalidatesTags: ["chat"] as any,
    }),
    getMyChatList: builder.query({
      query: (participantId: string) => ({
        url: `/chat/my-chat-list/${participantId}`,
      }),
      providesTags: ["chat"] as any,
    }),
    getSingleChat: builder.query({
      query: (chatId: string) => ({
        url: `/chat/${chatId}`,
      }),
      providesTags: ["chat"] as any,
    }),
  }),
});

export const {
  useAddNewChatMutation,
  useGetMyChatListQuery,
  useGetSingleChatQuery,
} = chatApi;
