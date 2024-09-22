import UploadFileIcon from "@mui/icons-material/UploadFile";

type Props = {
  setOpen: (value: boolean) => void;
  setFiles: (values: any) => void;
};

const DocumentUploader = ({ setOpen, setFiles }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(false);
    const newDocs = e.target.files;

    if (newDocs) {
      setFiles((prev: any) => {
        const prevFiles = prev ? Array.from(prev) : [];
        const newFiles = Array.from(newDocs);
        return [...prevFiles, ...newFiles];
      });
    }
  };
  return (
    <label htmlFor="files" className={`cursor-pointer w-full`}>
      <span className="flex items-center gap-2 w-full">
        <UploadFileIcon className={`text-blue-500 text-lg lg:text-2xl`} />
        <small className="font-sans text-lg">Document</small>
      </span>
      <input
        type="file"
        id="files"
        name="files"
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
    </label>
  );
};

export default DocumentUploader;
