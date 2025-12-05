"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { registerUser } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        "Sign Up"
      )}
    </Button>
  )
}

export function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage(null)
    const result = await registerUser(formData)
    if (result?.error) {
      setErrorMessage(result.error)
    }
    // If no error, redirect happens automatically
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="John Doe" 
          required 
          autoComplete="name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="name@example.com" 
          required 
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Must be at least 6 characters
        </p>
      </div>
      
      {errorMessage && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <SubmitButton />
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Sign in
        </Link>
      </div>
    </form>
  )
}
