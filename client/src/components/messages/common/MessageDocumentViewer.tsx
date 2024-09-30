/* eslint-disable @next/next/no-img-element */
import { IGetMedia } from "@/interfaces/message.interface";
import detectFileExtensionFromLink from "@/utils/detectFileExtensionFromLink";
import { codeExtensions } from "@/constants/extensions";
import CodeDocumentViewer from "./CodeDocumentViewer";
import DocxFileViewer from "./DocxFileViewer";
import PresentationFileViewer from "./PresentationFileViewer";
import dynamic from "next/dynamic";
import UnknownDocumentViewer from "./UnknownDocumentViewer";
const PdfFileViewer = dynamic(() => import("./PdfFileViewer"), {
  ssr: false,
});

type Props = {
  document: IGetMedia;
};

const MessageDocumentViewer = ({ document }: Props) => {
  const extension = detectFileExtensionFromLink(document?.url);

  return (
    <>
      {codeExtensions.includes(extension) ? (
        <CodeDocumentViewer key={document?.id} document={document} />
      ) : (
        <>
          {extension === "docx" ? (
            <DocxFileViewer documentUrl={document?.url} />
          ) : extension === "pptx" ? (
            <PresentationFileViewer documentUrl={document?.url} />
          ) : extension === "pdf" ? (
            <PdfFileViewer pdfFileUrl={document?.url} />
          ) : (
            <UnknownDocumentViewer
              fileUrl={document?.url}
              extension={extension}
            />
          )}
        </>
      )}
    </>
  );
};

export default MessageDocumentViewer;
