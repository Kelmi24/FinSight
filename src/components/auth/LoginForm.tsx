"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { authenticate } from "@/lib/actions/auth"
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
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage(null)
    
    // Add remember me to form data
    formData.set("rememberMe", rememberMe.toString())
    
    const error = await authenticate(formData)
    if (error) {
      setErrorMessage(error)
    }
    // If no error, redirect happens automatically via NextAuth
  }

  return (
    <form action={handleSubmit} className="space-y-4">
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link 
            href="/forgot-password" 
            className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input 
            id="password" 
            name="password" 
            type={showPassword ? "text" : "password"}
            required 
            autoComplete="current-password"
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
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
        />
        <Label htmlFor="rememberMe" className="text-sm font-normal text-gray-600 dark:text-gray-400 cursor-pointer">
          Remember me for 30 days
        </Label>
      </div>
      
      {errorMessage && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <SubmitButton />
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Sign up
        </Link>
      </div>
    </form>
  )
}
