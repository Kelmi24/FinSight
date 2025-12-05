"use client"

import React, { useRef, useState } from "react"
import { Upload, File, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
  disabled?: boolean
  acceptedFormats?: string[]
  maxSizeMB?: number
}

export function FileUploadZone({
  onFileSelect,
  isLoading = false,
  disabled = false,
  acceptedFormats = [".png", ".jpg", ".jpeg", ".pdf", ".webp"],
  maxSizeMB = 10,
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isLoading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled || isLoading) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleClear = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed transition-all duration-200",
        isDragging
          ? "border-indigo-500 bg-indigo-100"
          : "border-indigo-300 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100",
        (disabled || isLoading) && "opacity-60 cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isLoading}
      />

      {selectedFile && !isLoading ? (
        // Show selected file
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100 p-2">
                <File className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
              title="Clear selection"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        // Show upload zone
        <div className="p-6 text-center">
          <Upload className="mx-auto h-8 w-8 text-indigo-600 mb-3" />

          <p className="text-sm font-medium text-gray-900">
            {isLoading ? "Processing document..." : "Drag receipt or invoice here"}
          </p>
          <p className="text-xs text-gray-600 mt-1">or click to browse files</p>

          <p className="text-xs text-gray-500 mt-3">
            Supported: {acceptedFormats.join(", ")} (max {maxSizeMB}MB)
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className={cn(
              "mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              "bg-white border border-indigo-200 text-indigo-600",
              "hover:bg-indigo-50 hover:border-indigo-300",
              (disabled || isLoading) && "opacity-50 cursor-not-allowed"
            )}
          >
            Browse Files
          </button>
        </div>
      )}
    </div>
  )
}
