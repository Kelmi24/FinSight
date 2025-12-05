"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ParsedTransaction } from "@/lib/services/ocr-parser"
import { getConfidenceColor, formatConfidence } from "@/lib/services/ocr-parser"
import { useCurrency } from "@/providers/currency-provider"

interface ExtractionPreviewProps {
  extraction: ParsedTransaction
  processingTimeMs?: number
  onApply: () => void
  onBack: () => void
  isApplying?: boolean
}

export function ExtractionPreview({
  extraction,
  processingTimeMs,
  onApply,
  onBack,
  isApplying = false,
}: ExtractionPreviewProps) {
  const { formatCurrency } = useCurrency()
  const getConfidenceIcon = (confidence: number) => {
    const color = getConfidenceColor(confidence)
    if (color === "green") return <CheckCircle className="h-4 w-4 text-emerald-600" />
    if (color === "yellow")
      return <AlertTriangle className="h-4 w-4 text-amber-600" />
    return <AlertCircle className="h-4 w-4 text-red-600" />
  }

  const FieldRow = ({
    label,
    value,
    confidence,
    highlight = false,
  }: {
    label: string
    value: string | number | null
    confidence: number
    highlight?: boolean
  }) => (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg",
        highlight && "bg-indigo-50 border border-indigo-200"
      )}
    >
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm font-medium text-gray-900">
          {value || "Not detected"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {getConfidenceIcon(confidence)}
        <span className="text-xs font-medium text-gray-600">
          {formatConfidence(confidence)}
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            ✅ Extraction Complete
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Overall Confidence: {formatConfidence(extraction.totalConfidence)}
          </p>
          {processingTimeMs && (
            <p className="text-xs text-gray-500 mt-1">
              Processed in {(processingTimeMs / 1000).toFixed(2)}s
            </p>
          )}
        </div>
      </div>

      {/* Extracted fields */}
      <div className="space-y-2">
        <FieldRow
          label="Amount"
          value={
            extraction.amount.value !== null
              ? formatCurrency(extraction.amount.value)
              : null
          }
          confidence={extraction.amount.confidence}
          highlight={extraction.amount.confidence > 0.85}
        />

        <FieldRow
          label="Date"
          value={extraction.date.value}
          confidence={extraction.date.confidence}
          highlight={extraction.date.confidence > 0.85}
        />

        <FieldRow
          label="Type"
          value={extraction.type.value ? extraction.type.value.charAt(0).toUpperCase() + extraction.type.value.slice(1) : null}
          confidence={extraction.type.confidence}
          highlight={extraction.type.confidence > 0.85}
        />

        <FieldRow
          label="Category"
          value={extraction.category.primary}
          confidence={extraction.category.confidence}
          highlight={extraction.category.confidence > 0.85}
        />

        <FieldRow
          label="Merchant"
          value={extraction.merchant}
          confidence={0.7}
        />

        <FieldRow
          label="Description"
          value={extraction.description}
          confidence={0.75}
        />
      </div>

      {/* Alternative categories */}
      {extraction.category.alternatives.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-700 mb-2">Other possible categories:</p>
          <div className="space-y-1">
            {extraction.category.alternatives.map((alt, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-xs text-gray-600">{alt.name}</span>
                <span className="text-xs font-medium text-gray-500">
                  {formatConfidence(alt.confidence)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {extraction.totalConfidence < 0.7 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-700">
            ⚠️ Low overall confidence. Please review and edit the extracted data before applying.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isApplying}
          className="flex-1"
        >
          ← Back
        </Button>
        <Button
          type="button"
          onClick={onApply}
          disabled={isApplying}
          className="flex-1"
        >
          {isApplying ? "Applying..." : "Apply to Form"}
        </Button>
      </div>
    </div>
  )
}
