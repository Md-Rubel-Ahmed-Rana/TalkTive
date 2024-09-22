import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import FileUploadManager from "./FileUploadManager";
import MessageFilePreviews from "./MessageFilePreviews";

const MessageForm = () => {
  const [files, setFiles] = useState<any>(null);
  console.log(files);
  return (
    <div className="p-1 lg:p-4 mb-14 lg:mb-0 bg-gray-200 border-t border-gray-300 flex justify-between items-center relative">
      <div className="absolute bottom-10 left-0 bg-gray-200 pt-2 px-1">
        <MessageFilePreviews files={files} setFiles={setFiles} />
      </div>
      <form className="flex relative gap-1 lg:gap-2 justify-between items-center w-full">
        <FileUploadManager setFiles={setFiles} />
        <input
          className="w-full px-2 py-3 rounded-md focus:outline-blue-500 "
          type="text"
          name="text"
          placeholder="Type your message..."
        />
        <button className="px-3 py-2 bg-blue-500 rounded-full" type="submit">
          <SendIcon className="text-white text-2xl" />
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
