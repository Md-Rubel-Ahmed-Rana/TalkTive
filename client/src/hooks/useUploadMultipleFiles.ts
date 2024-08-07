import { useUploadMultipleFileMutation } from "@/features/fileUpload/file.api";
import Swal from "sweetalert2";
const useUploadMultipleFile = () => {
  const [uploadFiles] = useUploadMultipleFileMutation();
  const handleUploadFile = async (files: FileList, setFileUrls: any) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    try {
      const result: any = await uploadFiles(formData);
      console.log("result for files", result?.data?.data);
      if (result?.data?.success) {
        return setFileUrls(result?.data?.data);
      }
      if (result?.error) {
        Swal.fire({
          position: "center",
          icon: "error",
          text: result?.error?.data?.message,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Error uploading files",
        timer: 1500,
      });
    }
  };
  return handleUploadFile;
};

export default useUploadMultipleFile;
