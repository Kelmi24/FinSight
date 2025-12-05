/**
 * OCR Service
 * Handles document upload and text extraction using Tesseract.js
 */

import Tesseract from "tesseract.js"
import * as pdfParse from "pdf-parse"
import { parseTransactionFromOCR } from "./ocr-parser"

export interface OCRExtractionResult {
  success: boolean
  rawText?: string
  extraction?: ReturnType<typeof parseTransactionFromOCR>
  processingTimeMs?: number
  error?: string
}

/**
 * Extract text from an image file using Tesseract.js
 */
async function extractTextFromImage(file: File): Promise<string> {
  try {
    const result = await Tesseract.recognize(file, "eng", {
      logger: (m) => {
        // Optionally log progress
        if (m.status === "recognizing text") {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
        }
      },
    })

    return result.data.text
  } catch (error) {
    console.error("Image OCR failed:", error)
    throw new Error("Failed to extract text from image")
  }
}

/**
 * Extract text from a PDF file
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    // pdf-parse uses default export in runtime
    const parsePDF = (pdfParse as any).default || pdfParse
    const data = await parsePDF(Buffer.from(arrayBuffer))

    // Combine text from all pages
    const allText = data.text || ""
    return allText
  } catch (error) {
    console.error("PDF extraction failed:", error)
    throw new Error("Failed to extract text from PDF")
  }
}

/**
 * Process an uploaded document file
 * Returns extracted text and parsed transaction data
 */
export async function processDocumentOCR(file: File): Promise<OCRExtractionResult> {
  const startTime = Date.now()

  try {
    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/webp", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: `Unsupported file format: ${file.type}. Supported: PNG, JPG, WEBP, PDF`,
      }
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: "File too large. Maximum size is 10MB",
      }
    }

    let rawText: string

    // Extract text based on file type
    if (file.type === "application/pdf") {
      rawText = await extractTextFromPDF(file)
    } else {
      rawText = await extractTextFromImage(file)
    }

    if (!rawText || rawText.trim().length === 0) {
      return {
        success: false,
        error: "No text could be extracted from the document. Please ensure the document contains clear, readable text.",
      }
    }

    // Parse the extracted text to get transaction data
    const extraction = parseTransactionFromOCR(rawText)

    const processingTimeMs = Date.now() - startTime

    return {
      success: true,
      rawText,
      extraction,
      processingTimeMs,
    }
  } catch (error) {
    console.error("OCR processing failed:", error)
    const processingTimeMs = Date.now() - startTime

    return {
      success: false,
      processingTimeMs,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred during OCR processing",
    }
  }
}

/**
 * Validate file before upload
 */
export function validateFileBeforeUpload(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ["image/png", "image/jpeg", "image/webp", "application/pdf"]
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only PNG, JPG, WEBP, and PDF files are supported",
    }
  }

  // Check file size
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB`,
    }
  }

  return { valid: true }
}
