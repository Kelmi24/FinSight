"use client"

import { useState, useCallback } from "react"
import { processDocumentOCR, validateFileBeforeUpload } from "@/lib/services/ocr-service"
import type { ParsedTransaction } from "@/lib/services/ocr-parser"

interface OCRState {
  step: "idle" | "uploading" | "processing" | "preview" | "error"
  file: File | null
  rawText: string | null
  extraction: ParsedTransaction | null
  processingTimeMs: number | null
  error: string | null
}

export function useOCRExtraction() {
  const [state, setState] = useState<OCRState>({
    step: "idle",
    file: null,
    rawText: null,
    extraction: null,
    processingTimeMs: null,
    error: null,
  })

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    const validation = validateFileBeforeUpload(file)
    if (!validation.valid) {
      setState((prev) => ({
        ...prev,
        step: "error",
        error: validation.error || "Invalid file",
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      file,
      step: "processing",
      error: null,
    }))

    // Process the file
    const result = await processDocumentOCR(file)

    if (result.success && result.extraction && result.rawText) {
      setState((prev) => ({
        ...prev,
        step: "preview" as const,
        rawText: result.rawText || null,
        extraction: result.extraction || null,
        processingTimeMs: result.processingTimeMs || 0,
        error: null,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        step: "error" as const,
        error: result.error || "Failed to process document",
      }))
    }
  }, [])

  const handleApplyExtraction = useCallback(() => {
    // Return extraction data to caller
    return state.extraction
  }, [state.extraction])

  const handleBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: "idle",
      file: null,
      rawText: null,
      extraction: null,
      error: null,
    }))
  }, [])

  const handleReset = useCallback(() => {
    setState({
      step: "idle",
      file: null,
      rawText: null,
      extraction: null,
      processingTimeMs: null,
      error: null,
    })
  }, [])

  return {
    ...state,
    handleFileSelect,
    handleApplyExtraction,
    handleBack,
    handleReset,
  }
}
