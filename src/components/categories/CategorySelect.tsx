"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCategories, createCategory, deleteCategory } from "@/lib/actions/categories"
import { Plus, X, Trash2, ChevronDown, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  type: string
  color: string | null
  isDefault?: boolean
}

interface CategorySelectProps {
  name: string
  id?: string
  type: "income" | "expense"
  defaultValue?: string
  required?: boolean
  className?: string
}

const PRESET_COLORS = [
  "#F97316", "#3B82F6", "#EC4899", "#8B5CF6",
  "#06B6D4", "#EF4444", "#10B981", "#6366F1",
]

export function CategorySelect({
  name,
  id,
  type,
  defaultValue = "",
  required = false,
  className = "",
}: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const dialogRef = useRef<HTMLDialogElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    loadCategories()
  }, [type])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowDeleteConfirm(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [isOpen])

  async function loadCategories() {
    setIsLoading(true)
    const result = await getCategories(type)
    if (result.categories) {
      setCategories(result.categories)
    }
    setIsLoading(false)
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return

    setIsCreating(true)
    setError(null)

    const formData = new FormData()
    formData.set("name", newCategoryName.trim())
    formData.set("type", type)
    formData.set("color", selectedColor)

    const result = await createCategory(formData)

    if (result.error) {
      setError(result.error)
      setIsCreating(false)
      return
    }

    if (result.category) {
      setCategories(prev => [...prev, result.category as Category])
      setSelectedValue(result.category.name)
    }
    
    setNewCategoryName("")
    closeDialog()
    setIsCreating(false)
    setIsOpen(false)
  }

  async function handleDeleteCategory(categoryId: string, categoryName: string) {
    setIsDeleting(categoryId)
    const result = await deleteCategory(categoryId)
    
    if (result.error) {
      setError(result.error)
    } else {
      setCategories(prev => prev.filter(c => c.id !== categoryId))
      if (selectedValue === categoryName) {
        setSelectedValue("")
      }
    }
    
    setIsDeleting(null)
    setShowDeleteConfirm(null)
  }

  function openDialog() {
    dialogRef.current?.showModal()
  }

  function closeDialog() {
    dialogRef.current?.close()
    setError(null)
    setNewCategoryName("")
  }

  function handleSelectCategory(categoryName: string) {
    setSelectedValue(categoryName)
    setIsOpen(false)
  }

  const selectedCategory = categories.find(c => c.name === selectedValue)

  return (
    <>
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selectedValue} />

      <div ref={containerRef} className="relative">
        {/* Custom dropdown trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border-2",
            "bg-white px-3 py-2 text-sm transition-all duration-200",
            "border-gray-200 hover:border-gray-300",
            "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            "dark:bg-gray-900 dark:border-gray-700 dark:hover:border-gray-600",
            "dark:focus:border-blue-400 dark:focus:ring-blue-900/30",
            isOpen && "border-blue-500 ring-2 ring-blue-100 dark:border-blue-400",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {selectedCategory?.color ? (
              <span
                className="w-3 h-3 rounded-full ring-1 ring-gray-200"
                style={{ backgroundColor: selectedCategory.color }}
              />
            ) : (
              <Tag className="h-4 w-4 text-gray-400" />
            )}
            <span className={selectedValue ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}>
              {isLoading ? "Loading..." : selectedValue || "Select a category"}
            </span>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>

        {/* Dropdown panel - rendered in portal to avoid dialog clipping */}
        {isOpen && !isLoading && typeof document !== 'undefined' && createPortal(
          <div 
            className={cn(
              "fixed z-[100] rounded-xl",
              "bg-white border border-gray-200 shadow-xl",
              "dark:bg-gray-900 dark:border-gray-700",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              "max-h-80 overflow-hidden"
            )}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Categories list */}
            <div className="max-h-60 overflow-y-auto py-2">
              {categories.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No categories yet
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="group relative"
                  >
                    {showDeleteConfirm === cat.id ? (
                      // Delete confirmation
                      <div className="flex items-center justify-between px-3 py-2 bg-red-50 dark:bg-red-900/20">
                        <span className="text-sm text-red-700 dark:text-red-400">Delete "{cat.name}"?</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDeleteConfirm(null)
                            }}
                            className="px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            No
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteCategory(cat.id, cat.name)
                            }}
                            disabled={isDeleting === cat.id}
                            className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                          >
                            {isDeleting === cat.id ? "..." : "Yes"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Normal category item
                      <div
                        className={cn(
                          "flex items-center justify-between px-3 py-2 cursor-pointer",
                          "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                          "transition-colors duration-150",
                          selectedValue === cat.name && "bg-blue-50 dark:bg-blue-900/20"
                        )}
                        onClick={() => handleSelectCategory(cat.name)}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full ring-1 ring-gray-200 dark:ring-gray-600"
                            style={{ backgroundColor: cat.color || "#9CA3AF" }}
                          />
                          <span className={cn(
                            "text-sm",
                            selectedValue === cat.name ? "font-medium text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                          )}>
                            {cat.name}
                          </span>
                          {cat.isDefault && (
                            <span className="text-[10px] uppercase tracking-wide text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        
                        {/* Delete button for custom categories */}
                        {!cat.isDefault && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDeleteConfirm(cat.id)
                            }}
                            className={cn(
                              "p-1 rounded opacity-0 group-hover:opacity-100",
                              "text-gray-400 hover:text-red-500 hover:bg-red-50",
                              "dark:hover:bg-red-900/20 dark:hover:text-red-400",
                              "transition-all duration-150"
                            )}
                            title="Delete category"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add new category button */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  openDialog()
                }}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-lg",
                  "text-sm font-medium text-blue-600 dark:text-blue-400",
                  "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                  "transition-colors duration-150"
                )}
              >
                <Plus className="h-4 w-4" />
                Add new category
              </button>
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* Create category dialog */}
      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto backdrop:bg-black/50 rounded-xl p-0 shadow-2xl bg-white dark:bg-gray-900 dark:text-gray-50 border border-gray-200 dark:border-gray-800"
        style={{ width: '90%', maxWidth: '28rem', minWidth: '320px' }}
        onClose={(e) => {
          e.stopPropagation()
          setError(null)
          setNewCategoryName("")
        }}
        onClick={(e) => e.stopPropagation()}
        onCancel={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="relative w-full p-6" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              closeDialog()
            }}
            className="absolute right-4 top-4 rounded-md opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 p-1"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-lg font-semibold mb-4">Create New Category</h2>
          
          <div className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="newCategoryName">Category Name</Label>
              <Input
                id="newCategoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Groceries, Subscriptions..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleCreateCategory()
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    closeDialog()
                  }
                }}
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all duration-200",
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110"
                        : "hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  closeDialog()
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateCategory}
                disabled={isCreating || !newCategoryName.trim()}
              >
                <Plus className="mr-2 h-4 w-4" />
                {isCreating ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
