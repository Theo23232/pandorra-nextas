// Tremor Toaster [v0.0.0]

"use client"

import { useToast } from "@/hooks/use-toast"

import { Toast, ToastProvider, ToastViewport } from "./toast"

const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, ...props }) => {
        return (
          <Toast
            key={id}
            {...props}
            variant={
              (props.variant as
                | "info"
                | "success"
                | "warning"
                | "error"
                | "loading") ?? "info"
            }
            description={props.description as string}
            action={
              props.action
                ? {
                    ...props.action,
                    label: (props.action as any).label ?? "",
                    altText: (props.action as any).altText ?? "",
                    onClick: (props.action as any).onClick ?? (() => {}),
                  }
                : undefined
            }
          />
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export { Toaster }
