"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile, updateProfileImage, removeProfileImage } from "@/lib/actions/user"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Camera, Trash2, Loader2, User } from "lucide-react"

interface ProfileSectionProps {
  user: {
    name: string | null
    email: string | null
    image?: string | null
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
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isRemovingImage, setIsRemovingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentImage = imagePreview || user.image

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() || "U"

  const handleSubmit = async (formData: FormData) => {
    const result = await updateProfile(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image")
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB")
      return
    }

    // Read and preview the file
    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target?.result as string
      setImagePreview(base64)
      
      // Upload immediately
      setIsUploadingImage(true)
      const result = await updateProfileImage(base64)
      setIsUploadingImage(false)

      if (result.error) {
        toast.error(result.error)
        setImagePreview(null)
      } else {
        toast.success("Profile photo updated!")
      }
    }
    reader.readAsDataURL(file)

    // Reset input
    e.target.value = ""
  }

  const handleRemoveImage = async () => {
    setIsRemovingImage(true)
    const result = await removeProfileImage()
    setIsRemovingImage(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      setImagePreview(null)
      toast.success("Profile photo removed!")
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
      <CardContent className="space-y-6">
        {/* Profile Photo Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-gray-200">
          <div className="relative group">
            {/* Avatar */}
            {currentImage ? (
              <img
                src={currentImage}
                alt={user.name || "Profile"}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-600 text-2xl font-semibold text-white ring-4 ring-gray-100">
                {initials}
              </div>
            )}
            
            {/* Upload overlay */}
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage || isRemovingImage}
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              {currentImage ? "Change Photo" : "Upload Photo"}
            </Button>
            {currentImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isUploadingImage || isRemovingImage}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isRemovingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* Email (read-only) */}
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

        {/* Display Name */}
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
