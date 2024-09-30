import { Box } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DocumentDownloadButton from "./DocumentDownloadButton";

type Props = {
  pdfFileUrl: string;
};

const PDFViewer = ({ pdfFileUrl }: Props) => {
  return (
    <Box
      component={"div"}
      className="ring-1 w-40 h-40 rounded-md flex flex-col justify-between"
    >
      <PictureAsPdfIcon className="h-[80%] w-[90%] mx-auto text-red-500" />
      <DocumentDownloadButton fileUrl={pdfFileUrl} extension="pdf" />
    </Box>
  );
};

export default PDFViewer;
