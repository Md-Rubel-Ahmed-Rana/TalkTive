import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import fileDownload from "js-file-download";
import toast from "react-hot-toast";

type Props = {
  fileUrl: string;
  extension: string;
};

const DocumentDownloadButton = ({ fileUrl, extension }: Props) => {
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const time = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;
  const fileName = `Talktive_${currentDate}_${time}.${extension}`;

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });
      fileDownload(response.data, fileName);
      toast.success("File downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="contained"
      className="bg-blue-600"
      disabled={loading}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : "Download"}
    </Button>
  );
};

export default DocumentDownloadButton;
