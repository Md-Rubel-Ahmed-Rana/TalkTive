import { IGetMedia } from "@/interfaces/message.interface";
import detectFileExtensionFromLink from "@/utils/detectFileExtensionFromLink";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import DoneIcon from "@mui/icons-material/Done";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { codeViewerStylesMaterialOceanic } from "@/utils/codeViewerStyles";
import { Box, Button, Typography } from "@mui/material";
import CodeLoadingSkeleton from "@/components/skeletons/CodeLoadingSkeleton";

const getLanguage = (extension: string) => {
  const languageMap: { [key: string]: string } = {
    js: "javascript",
    ts: "typescript",
    html: "html",
    css: "css",
    json: "json",
  };
  return languageMap[extension] || "plaintext";
};

type Props = {
  document: IGetMedia;
};

const CodeDocumentViewer = ({ document }: Props) => {
  const [docContent, setDocContent] = useState<string | null>(null);
  const extension = detectFileExtensionFromLink(document?.url);
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  useEffect(() => {
    fetch(document.url)
      .then((response) => response.text())
      .then((text) => setDocContent(text))
      .catch((error) => console.error(error));
  }, [document]);

  const language = getLanguage(extension);

  const handleCopy = () => {
    if (docContent) {
      navigator.clipboard.writeText(docContent).then(() => {
        toast.success("Code copied to clipboard!");
        setIsCodeCopied(true);

        setTimeout(() => {
          setIsCodeCopied(false);
        }, 2000);
      });
    }
  };

  return (
    <Box component={"div"}>
      {docContent ? (
        <Box component={"div"} className="relative">
          <Button
            variant="outlined"
            className="absolute right-1 top-1 py-1 px-2 rounded-md z-50 text-white bg-purple-700"
            onClick={handleCopy}
          >
            {isCodeCopied ? (
              <Typography
                component={"span"}
                className="flex gap-1 items-center"
              >
                <DoneIcon className="text-sm" />
                <Typography className="text-xs" component={"small"}>
                  Copied
                </Typography>
              </Typography>
            ) : (
              <Typography
                component={"span"}
                className="flex gap-1 items-center"
              >
                <ContentCopyIcon className="text-sm" />
                <Typography className="text-xs" component={"small"}>
                  Copy Code
                </Typography>
              </Typography>
            )}
          </Button>
          <Box
            component={"div"}
            className="relative max-h-[400px] overflow-auto border border-gray-300 rounded-md"
          >
            <SyntaxHighlighter
              language={language}
              style={codeViewerStylesMaterialOceanic}
              showLineNumbers
              wrapLongLines
              wrapLines
              className="m-0 p-0"
            >
              {docContent}
            </SyntaxHighlighter>
          </Box>
        </Box>
      ) : (
        <CodeLoadingSkeleton />
      )}
    </Box>
  );
};

export default CodeDocumentViewer;
