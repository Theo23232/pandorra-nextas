"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Bounce from "@/components/animated/uibeats/bounce"
import { Footer } from "@/components/landing/footer"
import LandingNavbar from "@/components/landing/navbar"

export function AboutContent() {
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
      <div className="mx-auto max-w-5xl">
        <header className="my-12 md:my-16">
          <Bounce className="mb-6 mt-8 text-center text-5xl font-bold text-white md:text-7xl">
            {t(`À Propos de Pandorra`)}
          </Bounce>
          <Bounce className="mx-auto h-1 w-24 bg-purple-600 text-transparent">
            .
          </Bounce>
        </header>

        <main className="space-y-8">
          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            {t(
              `Chez Pandorra, nous repoussons les limites de la création numérique. Fondée en 2024 par Théo Lacour, originaire de la Guadeloupe, et Carine Léal, de Saint-Barthélemy, notre entreprise est née d'une passion commune pour l'innovation et la technologie. Le 6 mars 2025, nous avons lancé notre logiciel révolutionnaire qui transforme la manière dont les contenus visuels et audio sont conçus.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            {t(
              ` Spécialisés dans l'image, la vidéo, le texte et l'audio, nous offrons une plateforme tout-en-un pour créer des vidéos captivantes, des designs percutants et des expériences multimédias immersives. Que vous soyez un créateur indépendant, une entreprise ou un passionné de technologie, Pandorra.ai vous donne les outils pour donner vie à vos idées les plus audacieuses.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            {t(
              `Notre mission est simple : rendre la création accessible à tous, sans compromis sur la qualité ou la créativité. Grâce à l'intelligence artificielle, nous simplifions les processus complexes, permettant à chacun de produire des contenus professionnels en quelques clics.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            {t(
              `Rejoignez-nous dans cette aventure où l'innovation rencontre l'art, et où chaque projet devient une opportunité de raconter une histoire unique.`,
            )}
          </Bounce>
        </main>

        <div className="mt-16 text-center md:mt-24">
          <Bounce className="gdt text-3xl font-bold md:text-4xl">
            {t(`Pandorra.ai – Au service de votre créativité`)}
          </Bounce>
        </div>
      </div>

      <Footer />
    </>
  )
}
