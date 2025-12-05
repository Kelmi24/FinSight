"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CategoryDialog } from "./CategoryDialog"
import { deleteCategory } from "@/lib/actions/categories"
import { useRouter } from "next/navigation"
import { Edit2, Trash2, Plus, Tag } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

interface Category {
  id: string
  name: string
  type: string
  color: string | null
  isDefault: boolean
}

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return
    
    setDeletingId(id)
    const result = await deleteCategory(id)
    setDeletingId(null)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  function handleEdit(category: Category) {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  function handleAdd() {
    setEditingCategory(undefined)
    setIsDialogOpen(true)
  }

  const expenseCategories = categories.filter(c => c.type === "expense" || c.type === "both")
  const incomeCategories = categories.filter(c => c.type === "income" || c.type === "both")

  if (categories.length === 0) {
    return (
      <>
        <EmptyState
          title="No categories yet"
          description="Create custom categories to organize your transactions."
          icon={Tag}
          action={
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          }
        />
        <CategoryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          category={editingCategory}
        />
      </>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Expense Categories */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Expense Categories</h3>
          <div className="space-y-2">
            {expenseCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-gray-950 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color || "#9CA3AF" }}
                  />
                  <span className="font-medium">{category.name}</span>
                  {category.isDefault && (
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                {!category.isDefault && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Income Categories</h3>
          <div className="space-y-2">
            {incomeCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-gray-950 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color || "#9CA3AF" }}
                  />
                  <span className="font-medium">{category.name}</span>
                  {category.isDefault && (
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                {!category.isDefault && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
      />
    </>
  )
}
