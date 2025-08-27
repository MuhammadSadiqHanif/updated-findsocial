"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <Toast
          key={id}
          variant={variant}
          {...props}
          className={variant === "success" ? "bg-[#ecfdf3] border-[#abefc6] text-[#067647]" : ""}
        >
          <div className="flex items-start gap-3">
            {variant === "success" && <CheckCircle className="w-5 h-5 text-[#17b26a] mt-0.5 flex-shrink-0" />}
            <div className="flex-1">
              {title && <ToastTitle className="text-[#067647] font-medium">{title}</ToastTitle>}
              {description && <ToastDescription className="text-[#067647] text-sm">{description}</ToastDescription>}
            </div>
          </div>
          {action}
          <ToastClose className="text-[#067647] hover:text-[#067647]" />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
