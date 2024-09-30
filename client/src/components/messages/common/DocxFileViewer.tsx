import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Mammoth from "mammoth";

type Props = {
  documentUrl: string;
};

const DocxFileViewer = ({ documentUrl }: Props) => {
  const [docContent, setDocContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(documentUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => Mammoth.convertToHtml({ arrayBuffer: buffer }))
      .then((result) => setDocContent(result.value))
      .catch((error) => console.error(error));
  }, [documentUrl]);
  return (
    <Box
      component={"div"}
      className="doc-preview p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto max-h-[400px] font-sans leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: docContent || "<p>Loading...</p>",
      }}
    />
  );
};

export default DocxFileViewer;
