"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { registerUser } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? "Creating account..." : "Sign Up"}
    </Button>
  )
}

export function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    try {
      setErrorMessage(null)
      const result = await registerUser(formData)
      if (result?.error) {
        setErrorMessage(result.error)
      }
    } catch (e) {
      setErrorMessage("An unexpected error occurred.")
    }
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          required 
          minLength={6}
        />
      </div>
      
      {errorMessage && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-md text-sm">
          <AlertCircle className="h-4 w-4" />
          <p>{errorMessage}</p>
        </div>
      )}

      <SubmitButton />
      
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </div>
    </form>
  )
}
