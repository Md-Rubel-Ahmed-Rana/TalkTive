import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import ImageUploader from "./ImageUploader";
import VideoUploader from "./VideoUploader";
import AudioUploader from "./AudioUploader";
import DocumentUploader from "./DocumentUploader";

type Props = {
  setFiles: (values: FileList) => void;
};

const FileUploadManager = ({ setFiles }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2 items-center relative">
      {open && (
        <div className="absolute bottom-14 shadow-md p-2 bg-gray-200 flex flex-col gap-2 border-b">
          <ImageUploader setOpen={setOpen} setFiles={setFiles} />
          <VideoUploader setOpen={setOpen} setFiles={setFiles} />
          <AudioUploader setOpen={setOpen} setFiles={setFiles} />
          <DocumentUploader setOpen={setOpen} setFiles={setFiles} />
        </div>
      )}
      <ControlPointIcon
        onClick={() => setOpen((prev) => !prev)}
        className="text-blue-500 cursor-pointer text-3xl"
      />
      <AudioRecorder setFiles={setFiles} />
    </div>
  );
};

export default FileUploadManager;
