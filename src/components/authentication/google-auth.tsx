"use client"
import "./google-auth.css"

import { useRouter } from "next/navigation"
import Script from "next/script"
import { useEffect, useState } from "react"

import { Skeleton } from "@/components/nyxb/skeleton"
import { Button } from "@/components/tremor/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface GoogleAuthProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  redirectUrl?: string
  buttonText?: string
  className?: string
  variant?: "default" | "outline" | "ghost"
}

declare global {
  interface Window {
    google: any
  }
}

export const GoogleAuth = ({
  onSuccess,
  onError,
  redirectUrl = "/explore",
  className = "w-full",
}: GoogleAuthProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCharging, setIsCharging] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const initializeGoogle = () => {
    if (typeof window !== "undefined" && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleSuccess,
          auto_select: false,
          use_fedcm_for_prompt: true, // Active FedCM
        })

        // Rendre le bouton Google standard
        const buttonContainer = document.getElementById(
          "google-button-container",
        )
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            width: buttonContainer.offsetWidth,
          })
        }
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error)
        handleError("Failed to initialize Google Sign-In")
      }
    }
    setIsCharging(false)
  }

  const handleError = (message: string) => {
    setIsLoading(false)
    onError?.(message)
    toast({
      title: "Error",
      description: message,
      variant: "error",
      duration: 3000,
    })
  }

  const handleGoogleSuccess = async (response: any) => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || errorData.error)
      }

      const data = await res.json()
      if (data.token) {
        document.cookie = `auth-token=${data.token}; path=/`
        onSuccess?.()
        router.push(redirectUrl)
        router.refresh()
      }
    } catch (err: any) {
      handleError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Réinitialiser Google Sign-In lors du démontage
    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel()
      }
    }
  }, [])

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initializeGoogle}
      />

      <div
        id="google-button-container"
        className={cn(
          className,
          isCharging ? "hidden" : "",
          isLoading ? "hidden" : "",
        )}
        style={{ minHeight: "40px" }}
      />
      {isCharging && <Skeleton className="h-12 w-full" />}

      {isLoading && (
        <Button isLoading={true} variant="outline" className="w-full">
          Loading...
        </Button>
      )}
    </>
  )
}
