import AudiotrackIcon from "@mui/icons-material/Audiotrack";

type Props = {
  handleClosePopover: () => void;
  setFiles: (values: any) => void;
};

const AudioUploader = ({ handleClosePopover, setFiles }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAudios = e.target.files;
    if (newAudios) {
      setFiles((prev: any) => {
        const prevFiles = prev ? Array.from(prev) : [];
        const newFiles = Array.from(newAudios);
        return [...prevFiles, ...newFiles];
      });
      handleClosePopover();
    }
  };
  return (
    <label htmlFor="audios" className="cursor-pointer w-full pb-1">
      <span className="flex items-center gap-2 w-full">
        <AudiotrackIcon className={`text-blue-500 text-lg lg:text-2xl`} />
        <small className="font-sans text-lg">Audio</small>
      </span>
      <input
        type="file"
        id="audios"
        name="audios"
        className="hidden"
        accept="audio/*"
        multiple
        onChange={handleFileChange}
      />
    </label>
  );
};

export default AudioUploader;
