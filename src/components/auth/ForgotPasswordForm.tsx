"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { requestPasswordReset } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        "Send reset link"
      )}
    </Button>
  )
}

export function ForgotPasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    
    const result = await requestPasswordReset(formData)
    
    if (result.error) {
      setErrorMessage(result.error)
    } else if (result.success) {
      setSuccessMessage(result.success)
    }
  }

  if (successMessage) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Check your email
            </h3>
            <p className="text-sm text-gray-600">
              {successMessage}
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="Enter your email" 
            required 
            autoComplete="email"
            className="pl-10"
          />
        </div>
        <p className="text-xs text-gray-500">
          Enter the email associated with your account and we&apos;ll send you a reset link.
        </p>
      </div>
      
      {errorMessage && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <SubmitButton />
      
      <div className="text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </form>
  )
}
