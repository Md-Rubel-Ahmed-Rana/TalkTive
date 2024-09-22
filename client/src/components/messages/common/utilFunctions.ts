// Function to handle new messages
export const handleNewMessage = (
  data: any,
  setRealTimeMessages: React.Dispatch<React.SetStateAction<any[]>>
) => {
  setRealTimeMessages((prevMessages: any[]) => {
    // Check if the message is already in the state
    const isMessageExists = prevMessages.some(
      (message) => message.id === data.id
    );
    if (!isMessageExists) {
      return [...prevMessages, data];
    }
    return prevMessages;
  });
};

// Function to handle updated messages
export const handleUpdatedMessage = (
  data: any,
  setRealTimeMessages: React.Dispatch<React.SetStateAction<any[]>>
) => {
  setRealTimeMessages((prevMessages: any[]) => {
    const findIndex = prevMessages.findIndex(
      (message) => message?.id === data?.id
    );
    if (findIndex !== -1) {
      const updatedMessages = [...prevMessages];
      updatedMessages[findIndex] = data;
      return updatedMessages;
    }
    return prevMessages;
  });
};

// Function to handle deleted messages
export const handleDeletedMessage = (
  messageId: string,
  setRealTimeMessages: React.Dispatch<React.SetStateAction<any[]>>
) => {
  setRealTimeMessages((prevMessages: any[]) =>
    prevMessages.filter((message) => message.id !== messageId)
  );
};
