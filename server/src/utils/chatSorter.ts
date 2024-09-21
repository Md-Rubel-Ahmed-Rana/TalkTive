export const sortChatsByLastMessage = (chats: any[]): any[] => {
  return chats.sort((a, b) => {
    const lastMessageDateA = a.lastMessage?.createdAt || a.createdAt;
    const lastMessageDateB = b.lastMessage?.createdAt || b.createdAt;
    return (
      new Date(lastMessageDateB).getTime() -
      new Date(lastMessageDateA).getTime()
    );
  });
};
