import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

type Props = {
  setOpen: (value: boolean) => void;
  setFiles: (values: any) => void;
};

const VideoUploader = ({ setOpen, setFiles }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(false);
    const newVideos = e.target.files;

    if (newVideos) {
      setFiles((prev: any) => {
        const prevFiles = prev ? Array.from(prev) : [];
        const newFiles = Array.from(newVideos);
        return [...prevFiles, ...newFiles];
      });
    }
  };
  return (
    <label
      htmlFor="videos"
      className="cursor-pointer w-full border-b border-gray-400 pb-1"
    >
      <span className="flex items-center gap-2 w-full">
        <VideoLibraryIcon className={`text-blue-500 text-lg lg:text-2xl`} />
        <small className="font-sans text-lg">Video</small>
      </span>
      <input
        type="file"
        id="videos"
        name="videos"
        className="hidden"
        accept="video/*"
        multiple
        onChange={handleFileChange}
      />
    </label>
  );
};

export default VideoUploader;
