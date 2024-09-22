/* eslint-disable @next/next/no-img-element */
import { IGetMedia } from "@/interfaces/message.interface";
import { useEffect, useState } from "react";
import detectFileExtensionFromLink from "@/utils/detectFileExtensionFromLink";
import Mammoth from "mammoth";
import JSZip from "jszip";
import { codeExtensions } from "@/constants/extensions";
import CodeDocumentViewer from "./CodeDocumentViewer";

type Props = {
  document: IGetMedia;
};

const MessageDocumentViewer = ({ document }: Props) => {
  const [docContent, setDocContent] = useState<string | null>(null);
  const extension = detectFileExtensionFromLink(document?.url);

  useEffect(() => {
    if (extension === "docx") {
      fetch(document.url)
        .then((response) => response.arrayBuffer())
        .then((buffer) => Mammoth.extractRawText({ arrayBuffer: buffer }))
        .then((result) => setDocContent(result.value))
        .catch((error) => console.error(error));
    }

    if (extension === "pptx") {
      fetch(document.url)
        .then((response) => response.arrayBuffer())
        .then((buffer) => JSZip.loadAsync(buffer))
        .then((zip) => {
          zip
            .file("ppt/slides/slide1.xml")
            ?.async("string")
            .then((text) => {
              setDocContent(text);
            });
        })
        .catch((error) => console.error(error));
    }
  }, [document, extension]);

  return (
    <>
      {codeExtensions.includes(extension) ? (
        <CodeDocumentViewer key={document.id} document={document} />
      ) : (
        <pre>{docContent}</pre>
      )}
    </>
  );
};

export default MessageDocumentViewer;
