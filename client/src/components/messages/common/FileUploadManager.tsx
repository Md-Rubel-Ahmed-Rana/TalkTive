import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import ImageUploader from "./ImageUploader";
import VideoUploader from "./VideoUploader";
import AudioUploader from "./AudioUploader";
import DocumentUploader from "./DocumentUploader";
import { Button, Popover } from "@mui/material";

type Props = {
  setFiles: (values: FileList) => void;
};

const popoverId = "file-manager-popover";

const FileUploadManager = ({ setFiles }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpen = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const openPopover = Boolean(anchorEl);
  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  return (
    <div className="flex gap-2 items-center">
      <Popover
        id={popoverId}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            padding: "16px",
            maxWidth: "300px",
            marginTop: "-60px",
            marginLeft: "-14px",
          },
        }}
      >
        <div className="flex flex-col gap-2">
          <Button size="small" variant="outlined">
            <ImageUploader
              handleClosePopover={handleClosePopover}
              setFiles={setFiles}
            />
          </Button>
          <Button size="small" variant="outlined">
            <VideoUploader
              handleClosePopover={handleClosePopover}
              setFiles={setFiles}
            />
          </Button>
          <Button size="small" variant="outlined">
            <AudioUploader
              handleClosePopover={handleClosePopover}
              setFiles={setFiles}
            />
          </Button>
          <Button size="small" variant="outlined">
            <DocumentUploader
              handleClosePopover={handleClosePopover}
              setFiles={setFiles}
            />
          </Button>
        </div>
      </Popover>

      <ControlPointIcon
        onClick={handleOpen}
        className="text-blue-500 cursor-pointer text-3xl"
        aria-describedby={popoverId}
      />
      <AudioRecorder setFiles={setFiles} />
    </div>
  );
};

export default FileUploadManager;
