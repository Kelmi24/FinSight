/**
 * PDF text extraction utilities using PDF.js
 */

import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  error?: string;
}

/**
 * Extract text content from PDF file
 */
export async function extractTextFromPDF(
  file: File
): Promise<PDFExtractionResult> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const pageCount = pdf.numPages;
    let fullText = "";

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items with proper spacing
      const pageText = textContent.items
        .map((item: any) => {
          // Handle text items
          if ("str" in item) {
            return item.str;
          }
          return "";
        })
        .join(" ");

      fullText += pageText + "\n";
    }

    if (process.env.NODE_ENV === "development") {
      console.log("PDF Extraction Result:", {
        pageCount,
        textLength: fullText.length,
        preview: fullText.substring(0, 200),
      });
    }

    return {
      text: fullText,
      pageCount,
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    return {
      text: "",
      pageCount: 0,
      error:
        error instanceof Error
          ? error.message
          : "Failed to extract text from PDF",
    };
  }
}
