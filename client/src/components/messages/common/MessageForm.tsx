import SendIcon from "@mui/icons-material/Send";
import { useRef, useState } from "react";
import FileUploadManager from "./FileUploadManager";
import MessageFilePreviews from "./MessageFilePreviews";
import { useRouter } from "next/router";
import { useSendMessageMutation } from "@/features/message";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import toast from "react-hot-toast";
import SmallLoaderSpinner from "@/components/shared/SmallLoaderSpinner";

const MessageForm = () => {
  const [files, setFiles] = useState<any>(null);
  const [content, setContent] = useState("");
  const { query } = useRouter();
  const chatId = query?.chatId as string;
  const receiver = query?.userId as string;
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const inputRef = useRef<any>(null);

  const handleSendNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    if (files && files.length > 0) {
      Array.from(files).forEach((file: any) => {
        formData.append("files", file);
      });
    }

    formData.append("chatId", chatId);
    formData.append("sender", user?.id);
    formData.append("receiver", receiver);
    formData.append("content", content);

    try {
      const result: any = await sendMessage({
        sender: user?.id,
        receiver: receiver,
        data: formData,
      });

      if (result?.data?.statusCode === 201) {
        toast.success(result?.data?.message || "Your message has been sent!");
        setContent("");
        if (inputRef?.current) {
          inputRef.current.value = "";
        }
      } else {
        toast.error(
          result?.data?.message ||
            result?.error?.data?.message ||
            "Failed to send message"
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to send message");
    }
    setContent("");
    setFiles(null);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="p-1 lg:p-4 mb-14 lg:mb-0 bg-gray-200 border-t border-gray-300 flex justify-between items-center relative">
      <div className="absolute bottom-10 left-0 bg-gray-200 pt-2 px-1 pb-2 w-full">
        <MessageFilePreviews files={files} setFiles={setFiles} />
      </div>
      <form
        onSubmit={handleSendNewMessage}
        className="flex relative gap-1 lg:gap-2 justify-between items-center w-full"
      >
        <FileUploadManager setFiles={setFiles} />
        <input
          ref={inputRef}
          onChange={handleContentChange}
          className="w-full px-2 py-3 rounded-md focus:outline-blue-500 bg-white"
          type="text"
          name="text"
          defaultValue={content}
          placeholder="Type your message..."
        />
        <button
          className={`px-3 py-2 rounded-full lg:rounded-md ${
            !isLoading || content || (files && files.length > 0)
              ? "bg-blue-500"
              : "bg-gray-500 cursor-not-allowed"
          }`}
          type="submit"
          disabled={isLoading && !content && (!files || files.length === 0)}
        >
          {isLoading ? (
            <SmallLoaderSpinner />
          ) : (
            <SendIcon className="text-white text-2xl" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
