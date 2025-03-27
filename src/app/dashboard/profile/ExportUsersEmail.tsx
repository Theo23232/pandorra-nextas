"use client"
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function ExportUsersEmailsButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/export-users-csv", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Échec de l'export")
      }

      // Récupérer le fichier CSV
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "utilisateurs_pandorra.csv"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
      alert("Impossible d'exporter les emails")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={isLoading}>
      {isLoading ? "Export en cours..." : "Exporter les emails"}
    </Button>
  )
}
