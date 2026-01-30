import React from "react";

interface PdfViewerProps {
  html?: string;
  height?: number | string;
}

export function PdfViewer({ html, height = 600 }: PdfViewerProps) {
  if (!html) return null;
  const src = "data:text/html;charset=utf-8," + encodeURIComponent(html);
  return (
    <iframe
      title="PDF Preview"
      src={src}
      style={{ width: "100%", height }}
      className="rounded border"
    />
  );
}
