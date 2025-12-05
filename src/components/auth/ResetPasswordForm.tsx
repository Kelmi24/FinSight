"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { resetPassword } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Resetting...
        </>
      ) : (
        "Reset password"
      )}
    </Button>
  )
}

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    
    // Add token to form data
    formData.set("token", token)
    
    const result = await resetPassword(formData)
    
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
              Password reset successful!
            </h3>
            <p className="text-sm text-gray-600">
              Your password has been updated. You can now sign in with your new password.
            </p>
          </div>
        </div>
        
        <Link href="/login" className="block">
          <Button className="w-full">
            Continue to login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input 
            id="password" 
            name="password" 
            type={showPassword ? "text" : "password"}
            required 
            minLength={6}
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Must be at least 6 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type={showConfirmPassword ? "text" : "password"}
            required 
            minLength={6}
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
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
