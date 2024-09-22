import ImageIcon from "@mui/icons-material/Image";

type Props = {
  setOpen: (value: boolean) => void;
  setFiles: (values: any) => void;
};

const ImageUploader = ({ setOpen, setFiles }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(false);
    const newImages = e.target.files;

    if (newImages) {
      setFiles((prev: any) => {
        const prevFiles = prev ? Array.from(prev) : [];
        const newFiles = Array.from(newImages);
        return [...prevFiles, ...newFiles];
      });
    }
  };

  return (
    <label
      htmlFor="images"
      className="cursor-pointer w-full border-b border-gray-400 pb-1"
    >
      <span className="flex items-center gap-2 w-full">
        <ImageIcon className="text-blue-500 text-lg lg:text-2xl" />
        <small className="font-sans text-lg">Image</small>
      </span>
      <input
        type="file"
        id="images"
        name="images"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
    </label>
  );
};

export default ImageUploader;
