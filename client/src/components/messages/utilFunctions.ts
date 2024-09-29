import { IGetMessage } from "@/interfaces/message.interface";

// Function to handle new messages
export const handleNewMessage = (
  data: IGetMessage,
  setRealTimeMessages: React.Dispatch<React.SetStateAction<IGetMessage[]>>
) => {
  setRealTimeMessages((prevMessages: IGetMessage[]) => {
    // Check if the message is already in the state
    const isMessageExists = prevMessages.some(
      (message) => message?.id === data?.id
    );
    if (!isMessageExists) {
      return [...prevMessages, data];
    }
    return prevMessages;
  });
};

// Function to handle updated messages
export const handleUpdatedMessage = (
  data: IGetMessage,
  setRealTimeMessages: React.Dispatch<React.SetStateAction<IGetMessage[]>>
) => {
  setRealTimeMessages((prevMessages: IGetMessage[]) => {
    const findIndex = prevMessages?.findIndex(
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
  setRealTimeMessages: React.Dispatch<React.SetStateAction<IGetMessage[]>>
) => {
  setRealTimeMessages((prevMessages: IGetMessage[]) =>
    prevMessages?.filter((message) => message?.id !== messageId)
  );
};
