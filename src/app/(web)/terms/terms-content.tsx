"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Bounce from "@/components/animated/uibeats/bounce"
import { Footer } from "@/components/landing/footer"
import LandingNavbar from "@/components/landing/navbar"

export function TermsAndConditionsContent() {
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
            {t(`Termes et Conditions`)}
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
              1. Introduction
            </h2>
            {t(
              `Bienvenue sur Pandorra.ai, une plateforme proposant divers services d'intelligence artificielle, notamment le chat avec une IA, la conversion d'image en vidéo, la conversion de texte en image, l'assistant IA et la génération audio (le « Service »). En accédant ou en utilisant notre site Web à l'adresse https://pandorra.ai/ (le « Site »), vous acceptez d'être lié par les présentes Conditions générales (les « Conditions »). Ces Conditions régissent votre utilisation du Site et des Services fournis par Pandorra.ai, une société basée au Delaware, États-Unis.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`2. Admissibilité`)}
            </h2>
            {t(
              `Pour utiliser notre Service, vous devez avoir au moins 18 ans ou avoir atteint l'âge de la majorité dans votre juridiction. En utilisant le Service, vous déclarez et garantissez que vous remplissez cette condition d'éligibilité. Si vous utilisez le Service au nom d'une entreprise, d'une organisation ou d'une autre entité, vous déclarez et garantissez que vous avez le pouvoir de lier cette entité aux présentes Conditions.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`3. Enregistrement de compte`)}
            </h2>
            {t(
              `Pour accéder à certaines fonctionnalités du Service, vous devrez peut-être créer un compte. Vous acceptez de fournir des informations exactes, complètes et à jour lors du processus d'inscription et de mettre à jour ces informations si nécessaire. Vous êtes responsable de la protection des informations d'identification de votre compte et de toute activité ou action sous votre compte, qu'elle soit autorisée ou non. Vous devez nous informer immédiatement si vous suspectez une utilisation ou des activités non autorisées de votre compte.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`4. Utilisation du Service`)}
            </h2>
            <h3 className="mb-2 text-xl font-semibold text-white md:text-2xl">
              {t(`Utilisation autorisée :`)}
            </h3>
            {t(
              `Pandorra.ai vous accorde une licence limitée, non exclusive, non transférable et révocable pour utiliser le Service à des fins applicables, sous réserve des présentes Conditions. Vous acceptez de ne pas utiliser le Service à des fins illégales ou interdites par les présentes Conditions.`,
            )}
            <h3 className="mb-2 mt-4 text-xl font-semibold text-white md:text-2xl">
              {t(`Conduite interdite`)}
            </h3>
            {t(`Vous acceptez de ne pas :`)}
            <ul className="list-inside list-disc pl-4">
              <li>
                {t(
                  `Utiliser le Service pour générer ou distribuer tout contenu illégal, nuisible, abusif, diffamatoire, obscène ou autrement répréhensible.`,
                )}
              </li>
              <li>
                {t(
                  `Tenter de procéder à une ingénierie inverse, de décompiler ou de désassembler toute partie du Service.`,
                )}
              </li>
              <li>
                {t(
                  `Utiliser tout système automatisé, y compris les robots, les robots d'indexation ou les scrapers, pour accéder au Site ou au Service.`,
                )}
              </li>
              <li>
                {t(
                  `Participer à toute activité qui interfère avec ou perturbe le Service ou les serveurs et réseaux connectés au Service.`,
                )}
              </li>
              <li>
                {t(
                  `Utiliser le Service pour porter atteinte aux droits de propriété intellectuelle d'autrui.`,
                )}
              </li>
            </ul>
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`5. Contenu utilisateur`)}
            </h2>
            <h3 className="mb-2 text-xl font-semibold text-white md:text-2xl">
              {t(`Propriété et responsabilité`)}
            </h3>
            {t(
              `Vous conservez la propriété de tout contenu, y compris les vidéos, textes, images ou autres éléments, que vous téléchargez ou générez à l'aide du Service (« Contenu utilisateur »). Vous êtes seul responsable du Contenu utilisateur que vous créez, téléchargez, publiez ou partagez via le Service.`,
            )}
            <h3 className="mb-2 mt-4 text-xl font-semibold text-white md:text-2xl">
              Licence pour Pandorra.ai
            </h3>
            {t(
              `En soumettant du Contenu utilisateur au Service, vous accordez à Pandorra.ai une licence mondiale, non exclusive, libre de droits, sous-licenciable et transférable pour utiliser, reproduire, modifier, distribuer et afficher ce Contenu utilisateur dans le but d'exploiter, d'améliorer et de promouvoir le Service.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`6. Paiement et abonnement`)}
            </h2>
            <h3 className="mb-2 text-xl font-semibold text-white md:text-2xl">
              {t(`Frais`)}
            </h3>
            {t(
              `Certaines fonctionnalités du Service peuvent nécessiter le paiement de frais. Vous acceptez de payer tous les frais applicables associés à votre utilisation du Service. Pandorra.ai se réserve le droit de modifier ses frais et méthodes de facturation à tout moment après vous en avoir informé.`,
            )}
            <h3 className="mb-2 mt-4 text-xl font-semibold text-white md:text-2xl">
              {t(`Facturation`)}
            </h3>
            {t(
              `Les paiements pour le Service peuvent être traités par des processeurs de paiement tiers. En fournissant des informations de paiement, vous autorisez Pandorra.ai et ses processeurs de paiement à facturer les frais applicables à votre mode de paiement.`,
            )}
            <h3 className="mb-2 mt-4 text-xl font-semibold text-white md:text-2xl">
              {t(`Remboursements`)}
            </h3>
            {t(
              `Tous les frais payés pour le Service ne sont pas remboursables, sauf indication contraire. Pandorra.ai peut, à sa seule discrétion, fournir des remboursements ou des crédits dans des circonstances spécifiques, conformément à notre Politique de Remboursement.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`7. Loi applicable et juridiction`)}
            </h2>
            {t(
              `Ces Conditions sont régies par les lois de l'État du Delaware, États-Unis, sans tenir compte des principes de conflits de lois. Tout litige découlant de ces Conditions sera résolu exclusivement par les tribunaux compétents du Delaware.`,
            )}
          </Bounce>

          <Bounce className="text-xl leading-relaxed text-gray-200 md:text-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t(`8. Coordonnées`)}
            </h2>
            {t(
              `Si vous avez des questions ou des préoccupations concernant ces conditions, veuillez nous contacter à : contact@pandorra.ai.`,
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
