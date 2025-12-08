import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, Trash2, Info, AlertCircle } from "lucide-react"

type ConfirmDialogVariant = "danger" | "warning" | "info"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  variant?: ConfirmDialogVariant
  loading?: boolean
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconColor: "text-destructive",
    confirmButtonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-warning",
    confirmButtonClass: "bg-warning text-warning-foreground hover:bg-warning/90",
  },
  info: {
    icon: Info,
    iconColor: "text-info",
    confirmButtonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
}

/**
 * ConfirmDialog - Reusable confirmation dialog for destructive or important actions.
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   variant="danger"
 *   title="Delete Transaction"
 *   description="Are you sure you want to delete this transaction? This action cannot be undone."
 *   confirmText="Delete"
 *   onConfirm={handleDelete}
 *   loading={isDeleting}
 * />
 * ```
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 bg-${variant}/10`}>
              <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={config.confirmButtonClass}
          >
            {loading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * useConfirmDialog - Hook to manage confirmation dialog state.
 * 
 * @example
 * ```tsx
 * const { showConfirm, ConfirmDialog: Dialog } = useConfirmDialog()
 * 
 * const handleDelete = async () => {
 *   const confirmed = await showConfirm({
 *     title: "Delete Item",
 *     description: "This action cannot be undone.",
 *     variant: "danger",
 *   })
 *   if (confirmed) {
 *     // Perform delete
 *   }
 * }
 * 
 * return <Dialog />
 * ```
 */
export function useConfirmDialog() {
  const [config, setConfig] = React.useState<Omit<ConfirmDialogProps, "open" | "onOpenChange" | "onConfirm"> | null>(null)
  const [open, setOpen] = React.useState(false)
  const resolveRef = React.useRef<((value: boolean) => void) | null>(null)

  const showConfirm = React.useCallback((options: Omit<ConfirmDialogProps, "open" | "onOpenChange" | "onConfirm">) => {
    return new Promise<boolean>((resolve) => {
      setConfig(options)
      setOpen(true)
      resolveRef.current = resolve
    })
  }, [])

  const handleConfirm = React.useCallback(() => {
    resolveRef.current?.(true)
    setOpen(false)
  }, [])

  const handleCancel = React.useCallback(() => {
    resolveRef.current?.(false)
    setOpen(false)
  }, [])

  const Dialog = React.useCallback(() => {
    if (!config) return null
    
    return (
      <ConfirmDialog
        {...config}
        open={open}
        onOpenChange={handleCancel}
        onConfirm={handleConfirm}
      />
    )
  }, [config, open, handleCancel, handleConfirm])

  return { showConfirm, ConfirmDialog: Dialog }
}
