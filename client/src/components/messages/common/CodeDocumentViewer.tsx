import { IGetMedia } from "@/interfaces/message.interface";
import detectFileExtensionFromLink from "@/utils/detectFileExtensionFromLink";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import DoneIcon from "@mui/icons-material/Done";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { codeViewerStylesMaterialOceanic } from "@/utils/codeViewerStyles";

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
    <div>
      {docContent ? (
        <div className="relative">
          <button
            className="absolute right-1 top-1 py-1 px-2 rounded-md z-50 text-white bg-purple-700"
            onClick={handleCopy}
          >
            {isCodeCopied ? (
              <span className="flex gap-1 items-center">
                <DoneIcon className="text-sm" />
                <small>Copied</small>
              </span>
            ) : (
              <span className="flex gap-1 items-center">
                <ContentCopyIcon className="text-sm" />
                <small>Copy Code</small>
              </span>
            )}
          </button>
          <SyntaxHighlighter
            language={language}
            style={codeViewerStylesMaterialOceanic}
          >
            {docContent}
          </SyntaxHighlighter>
        </div>
      ) : (
        <p>Loading code content...</p>
      )}
    </div>
  );
};

export default CodeDocumentViewer;
