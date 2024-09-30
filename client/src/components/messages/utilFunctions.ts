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

export const getSenderName = (senderName: string): string => {
  const senderSplitName = senderName?.split(" ") || [];

  if (senderSplitName.length === 1) {
    return senderSplitName[0];
  } else if (senderSplitName.length >= 2) {
    return `${senderSplitName[0]} ${senderSplitName[1]}`;
  }

  return "";
};

export const VideoDetector = (content: string): string | false => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const detectedUrl = content.match(urlRegex);

  if (!detectedUrl) return false;

  const url = detectedUrl[0];
  let videoId;
  let embedUrl;

  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1]?.split("&")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("youtube.com/shorts/")) {
    videoId = url.split("shorts/")[1]?.split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("facebook.com") || url.includes("fb.watch/")) {
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}`;
  }

  return embedUrl || false;
};
