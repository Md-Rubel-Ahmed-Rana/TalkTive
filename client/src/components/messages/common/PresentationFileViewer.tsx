import { Box, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import DocumentDownloadButton from "./DocumentDownloadButton";

type Props = {
  documentUrl: string;
};

const PresentationFileViewer = ({ documentUrl }: Props) => {
  return (
    <Box
      component={"div"}
      className="ring-1 w-40 h-40 rounded-md flex flex-col justify-between relative"
    >
      <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-yellow-800 px-4 py-1 text-white">
        PPTX
      </Typography>
      <DescriptionIcon className="h-[80%] w-[90%] mx-auto text-yellow-500" />
      <DocumentDownloadButton fileUrl={documentUrl} extension="pptx" />
    </Box>
  );
};

export default PresentationFileViewer;
