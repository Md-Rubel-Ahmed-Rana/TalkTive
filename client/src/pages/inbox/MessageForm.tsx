/* eslint-disable @next/next/no-img-element */
import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaImage, FaFile } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import useUploadMultipleFile from "@/hooks/useUploadMultipleFiles";
import { IUser } from "@/interfaces/user.interface";
import { SocketContext } from "@/context/SocketContext";
import { IMessage } from "@/interfaces/message.interface";
import { useLoggedInUserQuery } from "@/features/user/user.api";
import { useSendMessageMutation } from "@/features/message/message.api";

type Inputs = {
  sender?: string;
  receiver?: string;
  content?: string;
  images?: FileList | string[];
  files?: FileList | string[];
};

type Props = {
  selectedUser: IUser;
};

const MessageForm = ({ selectedUser }: Props) => {
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;
  const { socket, setRealTimeMessages }: any = useContext(SocketContext);
  const { register, handleSubmit, reset } = useForm<Inputs>({
    mode: "onChange",
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [filePreview, setFilePreview] = useState<string[]>([]);
  const [images, setImages] = useState<FileList | undefined | null>(null);
  const [files, setFiles] = useState<FileList | undefined | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [filesUrls, setFileUrls] = useState<string[]>([]);
  const uploadImages = useUploadMultipleFile();
  const uploadFiles = useUploadMultipleFile();
  const [sendMessage] = useSendMessageMutation();
  const [isMessage, setIsMessage] = useState(false);

  console.log(imageUrls);

  const handleSendMessage: SubmitHandler<Inputs> = async (data) => {
    if (files && files?.length > 0) {
      const result = await uploadFiles(files, setFileUrls);
      console.log("Result for file", result);
    }
    if (images && images.length > 0) {
      const result = await uploadImages(images, setImageUrls);
      console.log("Result for image", result);
    }
    console.log({ imageUrls });
    data.files = filesUrls!;
    data.images = imageUrls!;
    data.sender = user?.id;
    data.receiver = selectedUser?.id;
    console.log("Data", data);
    const result: any = await sendMessage(data);
    if (result?.data?.success) {
      const message = result?.data?.data;
      socket.emit("message", message);
      setRealTimeMessages((prev: IMessage[]) => [...prev, message]);

      setImagePreview([]);
      setFilePreview([]);
      setImages(null);
      setFiles(null);
      setLinks([]);
      setImageUrls([]);
      setFileUrls([]);
      setIsMessage(false);
      reset();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImages(files);
    if (files) {
      const previewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreview((prev) => prev.concat(previewUrls));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFiles(files);
    if (files) {
      const previewUrls = Array.from(files).map((file) => file.name);
      setFilePreview((prev) => prev.concat(previewUrls));
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...imagePreview];
    updatedImages.splice(index, 1);
    setImagePreview(updatedImages);

    const updatedFiles = Array.from(images!).filter(
      (_, i) => i !== index
    ) as unknown as FileList;
    setImages(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...filePreview];
    updatedFiles.splice(index, 1);
    setFilePreview(updatedFiles);

    const updatedFilesList = Array.from(files!).filter(
      (_, i) => i !== index
    ) as unknown as FileList;
    setFiles(updatedFilesList);
  };

  return (
    <div className="mx-auto bg-gray-200 dark:bg-gray-700 shadow-md px-6 py-2 mt-8">
      {/* Image Preview Section */}
      {imagePreview.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {imagePreview?.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-16 h-16 rounded-md"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 p-1 bg-white rounded-full text-red-500 hover:bg-gray-100"
              >
                <RxCross2 />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Preview Section */}
      {filePreview.length > 0 && (
        <div className="mb-4">
          {filePreview?.map((fileName, index) => (
            <div key={index} className="relative">
              <div className="text-blue-500 hover:underline block mb-2">
                <small>{fileName}</small>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute top-0 right-0 p-1 bg-white rounded-full text-red-500 hover:bg-gray-100"
              >
                <RxCross2 />
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleSendMessage)}
        className="flex  gap-3 items-center"
      >
        <label htmlFor="images" className="cursor-pointer">
          <FaImage className="text-blue-500 hover:underline" />
          <input
            type="file"
            id="images"
            {...register("images")}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </label>

        <label htmlFor="files" className="cursor-pointer">
          <FaFile
            title="Only pdf and video file supported"
            className="text-blue-500 hover:underline"
          />
          <input
            type="file"
            id="files"
            {...register("files")}
            className="hidden"
            accept="application/pdf, pdf,mp4,avi,mov,mkv,wmv,flv,mpeg,mpg,webm,3gp"
            onChange={handleFileChange}
            multiple
          />
        </label>

        <input
          type="text"
          {...register("content")}
          placeholder="Type your message..."
          onChange={(e) => setIsMessage(e.target.value ? true : false)}
          className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 flex-grow"
        />

        <button
          disabled={
            links.length <= 0 &&
            filePreview.length <= 0 &&
            imagePreview.length <= 0 &&
            !isMessage
          }
          type="submit"
          className={`${
            links.length <= 0 &&
            filePreview.length <= 0 &&
            imagePreview.length <= 0 &&
            !isMessage
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white px-4 py-2 rounded-md  focus:outline-none`}
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
