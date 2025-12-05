"use client"
 
 import * as React from "react"
 import * as SelectPrimitive from "@radix-ui/react-select"
 import { Check, ChevronDown } from "lucide-react"
 import { cn } from "@/lib/utils"
 
 export interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {}
 
 export function Select({ children, ...props }: SelectProps) {
   return (
     <SelectPrimitive.Root {...props}>
       {children}
     </SelectPrimitive.Root>
   )
 }
 
 export const SelectTrigger = React.forwardRef<
   React.ElementRef<typeof SelectPrimitive.Trigger>,
   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
 >(({ className, children, ...props }, ref) => (
   <SelectPrimitive.Trigger
     ref={ref}
     className={cn(
       "flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 [&>span]:line-clamp-1",
       "hover:border-gray-400 transition-colors duration-200",
       "data-[state=open]:border-primary-500 data-[state=open]:ring-2 data-[state=open]:ring-primary-100",
       className
     )}
     {...props}
   >
     {children}
     <SelectPrimitive.Icon asChild>
       <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 data-[state=open]:rotate-180" />
     </SelectPrimitive.Icon>
   </SelectPrimitive.Trigger>
 ))
 SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
 
 export const SelectValue = SelectPrimitive.Value
 
 export const SelectContent = React.forwardRef<
   React.ElementRef<typeof SelectPrimitive.Content>,
   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
 >(({ className, children, position = "popper", ...props }, ref) => (
   <SelectPrimitive.Portal>
     <SelectPrimitive.Content
       ref={ref}
       className={cn(
         "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-dropdown data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
         position === "popper" &&
           "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
         className
       )}
       position={position}
       {...props}
     >
       <SelectPrimitive.Viewport
         className={cn(
           "p-1",
           position === "popper" &&
             "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
         )}
       >
         {children}
       </SelectPrimitive.Viewport>
     </SelectPrimitive.Content>
   </SelectPrimitive.Portal>
 ))
 SelectContent.displayName = SelectPrimitive.Content.displayName
 
 export const SelectItem = React.forwardRef<
   React.ElementRef<typeof SelectPrimitive.Item>,
   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
 >(({ className, children, ...props }, ref) => (
   <SelectPrimitive.Item
     ref={ref}
     className={cn(
       "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
       "hover:bg-gray-50 transition-colors duration-150 mx-1",
       "data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-700",
       className
     )}
     {...props}
   >
     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
       <SelectPrimitive.ItemIndicator>
         <Check className="h-4 w-4 text-primary-600" />
       </SelectPrimitive.ItemIndicator>
     </span>
 
     <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
   </SelectPrimitive.Item>
 ))
 SelectItem.displayName = SelectPrimitive.Item.displayName
