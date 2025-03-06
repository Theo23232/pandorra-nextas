"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Bounce from "@/components/animated/uibeats/bounce"
import { Footer } from "@/components/landing/footer"
import LandingNavbar from "@/components/landing/navbar"

export function RefundPolicyContent() {
  const { t } = useTranslation()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />
      <LandingNavbar />
      <div className="mx-auto max-w-5xl px-4">
        <header className="my-12 md:my-16">
          <Bounce className="mb-6 text-center text-5xl font-bold text-white md:text-7xl">
            {t(`Politique de Remboursement`)}
          </Bounce>
          <Bounce className="mx-auto h-1 w-24 bg-purple-600 text-transparent">
            .
          </Bounce>
        </header>

        <main className="space-y-8">
          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            {t(`Date d'entrée en vigueur : 26 Février 2025`)}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`1. Admissibilité au remboursement`)}
            </h2>
            <ul className="list-inside list-disc pl-4">
              <li>
                {t(
                  `Délai : Les demandes de remboursement doivent être effectuées dans les 3 jours suivant votre achat.`,
                )}
              </li>
              <li>
                {t(
                  `Utilisation du crédit : Si vous avez utilisé plus de 50 crédits, vous n'avez pas droit à un remboursement.`,
                )}
              </li>
            </ul>
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`2. Comment demander un remboursement`)}
            </h2>
            <ul className="list-inside list-disc pl-4">
              <li>{t(`Contactez-nous à contact@pandorra.ai.`)}</li>
              <li>
                {t(
                  `Fournissez les détails de votre compte, le numéro de commande, la date d'achat et le motif de la demande.`,
                )}
              </li>
              <li>
                {t(`Soumettez votre demande dans les 3 jours suivant l'achat.`)}
              </li>
            </ul>
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`3. Traitement des remboursements`)}
            </h2>
            {t(
              `Les remboursements approuvés seront traités sur votre mode de paiement d'origine dans un délai de 10 jours ouvrables.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`4. Loi applicable`)}
            </h2>
            {t(
              `Cette politique de remboursement est régie par les lois de l'État du Delaware, États-Unis.`,
            )}
          </Bounce>
        </main>

        <div className="mt-16 text-center md:mt-24">
          <Bounce className="gdt text-3xl font-bold md:text-4xl">
            {t(`Pandorra.ai – Votre satisfaction, notre priorité`)}
          </Bounce>
        </div>
      </div>

      <Footer />
    </>
  )
}
