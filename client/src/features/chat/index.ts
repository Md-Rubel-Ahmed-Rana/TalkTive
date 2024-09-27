import { IChat, IEditGroup } from "@/interfaces/chat.interface";
import apiSlice from "../api/apiSlice";

const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewChat: builder.mutation({
      query: (data: FormData) => ({
        method: "POST",
        url: "/chat/add-new-chat",
        body: data,
      }),
      invalidatesTags: ["chat"] as any,
    }),
    addNewMember: builder.mutation({
      query: ({
        chatId,
        participantId,
      }: {
        chatId: string;
        participantId: string;
      }) => ({
        method: "PATCH",
        url: `/chat/add-new-participant/${chatId}/${participantId}`,
      }),
      invalidatesTags: ["chat", "user"] as any,
    }),
    deleteGroup: builder.mutation({
      query: (chatId) => ({
        method: "DELETE",
        url: `/chat/delete/${chatId}`,
      }),
      invalidatesTags: ["chat", "user"] as any,
    }),
    updateGroup: builder.mutation({
      query: ({ chatId, data }: { chatId: string; data: IEditGroup }) => ({
        method: "PATCH",
        url: `/chat/update/${chatId}`,
        body: data,
      }),
      invalidatesTags: ["chat", "user"] as any,
    }),
    changeGroupImage: builder.mutation({
      query: ({ chatId, image }: { chatId: string; image: FormData }) => ({
        method: "PATCH",
        url: `/chat/change-group-image/${chatId}`,
        body: image,
      }),
      invalidatesTags: ["chat", "user"] as any,
    }),
    removeMember: builder.mutation({
      query: ({
        chatId,
        participantId,
      }: {
        chatId: string;
        participantId: string;
      }) => ({
        method: "PATCH",
        url: `/chat/remove-participant/${chatId}/${participantId}`,
      }),
      invalidatesTags: ["chat", "user"] as any,
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
    getChatByTwoParticipants: builder.query({
      query: ({
        participant1,
        participant2,
      }: {
        participant1: string;
        participant2: string;
      }) => ({
        url: `/chat/single/${participant1}/${participant2}`,
      }),
      providesTags: ["chat"] as any,
    }),
  }),
});

export const {
  useAddNewChatMutation,
  useGetMyChatListQuery,
  useGetSingleChatQuery,
  useLazyGetChatByTwoParticipantsQuery,
  useAddNewMemberMutation,
  useRemoveMemberMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
  useChangeGroupImageMutation,
} = chatApi;
