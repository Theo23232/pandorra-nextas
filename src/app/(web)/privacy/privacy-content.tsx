"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Bounce from "@/components/animated/uibeats/bounce"
import { Footer } from "@/components/landing/footer"
import LandingNavbar from "@/components/landing/navbar"

export function PrivacyPolicyContent() {
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
      <div className="mx-auto mt-36 max-w-5xl px-4">
        <header className="my-12 md:my-16">
          <Bounce className="mb-6 text-center text-5xl font-bold text-white md:text-7xl">
            {t(`Politique de Confidentialité`)}
          </Bounce>
          <Bounce className="mx-auto h-1 w-24 bg-purple-600 text-transparent">
            .
          </Bounce>
        </header>

        <main className="space-y-8">
          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            {t(`Date d'entrée en vigueur : 26 février 2025`)}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`1. Introduction`)}
            </h2>
            {t(
              `La présente politique de confidentialité de Pandorra.ai (« Nous », « Notre » ou « Nos ») décrit nos politiques et procédures sur la manière dont nous collectons, stockons, utilisons et/ou partageons vos informations lorsque vous utilisez notre service. Cela comprend l'utilisation de notre site Web à l'adresse https://pandorra.ai/ (le « site Web ») et de l'application mobile Pandorra.ai (l'« application ») disponible sur l'App Store d'Apple et le Google Play Store.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`2. Collecte et utilisation de vos données personnelles`)}
            </h2>
            <h3 className="mb-2 text-xl font-semibold text-white md:text-2xl">
              {t(`Types de données que nous pouvons collecter`)}
            </h3>
            {t(`Nous pouvons collecter les informations suivantes :`)}
            <ul className="list-inside list-disc pl-4">
              <li>{t(`Adresse email`)}</li>
              <li>{t(`Données d'utilisation`)}</li>
              <li>{t(`Informations sur les réseaux sociaux`)}</li>
              <li>{t(`Cookies Web`)}</li>
            </ul>
            <h3 className="mb-2 mt-4 text-xl font-semibold text-white md:text-2xl">
              {t(`Utilisation de vos données personnelles`)}
            </h3>
            {t(`Nous utilisons vos données pour :`)}
            <ul className="list-inside list-disc pl-4">
              <li>{t(`Fournir et maintenir notre service.`)}</li>
              <li>{t(`Gérer votre compte.`)}</li>
              <li>
                {t(
                  `Vous fournir des nouvelles, des offres spéciales et des informations générales.`,
                )}
              </li>
            </ul>
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`3. Conservation de vos données personnelles`)}
            </h2>
            {t(
              `Nous conservons vos données personnelles uniquement aussi longtemps que nécessaire aux fins énoncées dans la présente politique de confidentialité.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`4. Sécurité de vos données personnelles`)}
            </h2>
            {t(
              `Nous utilisons des mesures de sécurité commercialement raisonnables pour protéger vos données, mais aucune méthode de transmission sur Internet ou de stockage électronique n'est sûre à 100 %.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`5. Vos droits`)}
            </h2>
            {t(
              `Vous avez le droit de demander l'accès, la correction ou la suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à contact@pandorra.ai.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`6. Loi applicable`)}
            </h2>
            {t(
              `Cette politique de confidentialité est régie par les lois de l'État du Delaware, États-Unis.`,
            )}
          </Bounce>
        </main>

        <div className="mt-16 text-center md:mt-24">
          <Bounce className="gdt text-3xl font-bold md:text-4xl">
            {t(`Pandorra.ai – Votre confidentialité, notre priorité`)}
          </Bounce>
        </div>
      </div>

      <Footer />
    </>
  )
}
