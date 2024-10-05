/* eslint-disable @next/next/no-img-element */
import mime from "mime-types";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import MovieIcon from "@mui/icons-material/Movie";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DescriptionIcon from "@mui/icons-material/Description";
import { useState, useEffect } from "react";

type Props = {
  files: FileList | undefined | null;
  setFiles: (values: FileList) => void;
};

const MessageFilePreviews = ({ files, setFiles }: Props) => {
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  useEffect(() => {
    const filePreviewsArray: string[] = [];
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        if (file.type.startsWith("image") || file.type.startsWith("video")) {
          reader.onload = () => {
            filePreviewsArray.push(reader.result as string);
            setFilePreviews([...filePreviewsArray]);
          };
          reader.readAsDataURL(file);
        } else {
          filePreviewsArray.push(file.name);
          setFilePreviews([...filePreviewsArray]);
        }
      });
    }
  }, [files]);

  const getFileIcon = (file: File) => {
    const mimeType = mime.lookup(file.name) || file.type;

    if (mimeType?.startsWith("image"))
      return <ImageIcon className="text-blue-500" />;
    if (mimeType?.startsWith("video"))
      return <MovieIcon className="text-blue-500" />;
    if (mimeType?.startsWith("audio"))
      return <MusicNoteIcon className="text-blue-500" />;
    if (mimeType === "application/pdf")
      return <PictureAsPdfIcon className="text-red-500" />;
    return <DescriptionIcon className="text-gray-500" />;
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...filePreviews];
    updatedFiles.splice(index, 1);
    setFilePreviews(updatedFiles);

    const updatedFilesList = Array.from(files!).filter(
      (_, i) => i !== index
    ) as unknown as FileList;
    setFiles(updatedFilesList);
  };

  return (
    <>
      {filePreviews?.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {files &&
            files?.length > 0 &&
            Array.from(files!).map((file, index) => (
              <div
                key={index}
                className="relative mb-2 flex items-center gap-2"
              >
                {file.type.startsWith("image") && (
                  <img
                    src={filePreviews[index]}
                    alt="preview"
                    className="w-16 h-16 object-cover ring-1"
                  />
                )}
                {file.type.startsWith("video") && (
                  <video controls className="w-16 h-16 ring-1">
                    <source src={filePreviews[index]} type={file.type} />
                  </video>
                )}
                {file.type.startsWith("audio") && (
                  <div className="w-16 h-16 flex items-center justify-center ring-1">
                    <MusicNoteIcon className="text-blue-500" />
                  </div>
                )}
                {!file.type.startsWith("image") &&
                  !file.type.startsWith("video") &&
                  !file.type.startsWith("audio") && (
                    <div className="w-16 h-16 flex items-center justify-center ring-1">
                      {getFileIcon(file)}
                    </div>
                  )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-0 right-0 p-1 bg-white rounded-full text-red-500 hover:bg-gray-100"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default MessageFilePreviews;
