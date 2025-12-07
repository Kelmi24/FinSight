/**
 * PDF text extraction utilities using PDF.js
 * Client-side only - do not use in server components
 */

// Only import in browser environment
let pdfjsLib: any = null;

if (typeof window !== "undefined") {
  import("pdfjs-dist").then((module) => {
    pdfjsLib = module;
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  });
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
  // Ensure we're in browser environment
  if (typeof window === "undefined") {
    return {
      text: "",
      pageCount: 0,
      error: "PDF parsing is only available in browser environment",
    };
  }

  // Dynamically import pdfjs-dist
  if (!pdfjsLib) {
    const module = await import("pdfjs-dist");
    pdfjsLib = module;
    // Use webpack to bundle the worker file
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

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
