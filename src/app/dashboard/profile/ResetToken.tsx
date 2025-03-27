"use client"
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function ResetToken() {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/reset-token", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Échec de l'export")
      }

      // Récupérer le fichier CSV
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={isLoading} variant={"destructive"}>
      {isLoading ? "Reset en cours..." : "Reset les credits"}
    </Button>
  )
}
