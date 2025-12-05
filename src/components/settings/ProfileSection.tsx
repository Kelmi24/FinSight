"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/lib/actions/user"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

interface ProfileSectionProps {
  user: {
    name: string | null
    email: string | null
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  )
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    const result = await updateProfile(formData)
    if (result.error) {
     toast.error(result.error)
    } else {
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your public profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            value={user.email || ""} 
            disabled 
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email addresses cannot be changed at this time.
          </p>
        </div>

        {isEditing ? (
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={user.name || ""} 
                placeholder="Your Name"
                required
              />
            </div>
            <div className="flex gap-2">
              <SubmitButton />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <div className="p-2 border rounded-md bg-muted/20">
                {user.name || "Not set"}
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
