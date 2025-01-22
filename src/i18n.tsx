"use client"
import i18next from "i18next"
import { useEffect, useState } from "react"
import { initReactI18next } from "react-i18next"

import translationEnglish from "./translation/en.json"
import translationEspania from "./translation/es.json"
import translationFrench from "./translation/fr.json"
import translationItalian from "./translation/ita.json"

const resources = {
  en: {
    translation: translationEnglish,
  },
  fr: {
    translation: translationFrench,
  },
  it: {
    translation: translationItalian,
  },
  es: {
    translation: translationEspania,
  },
}

const detectBrowserLanguage = (): string => {
  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    const browserLang = navigator.language.substring(0, 2).toLowerCase()
    return ["fr", "en", "it", "es"].includes(browserLang) ? browserLang : "en"
  }
  return "en" // Valeur par défaut pour le serveur
}

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<string>("en")

  useEffect(() => {
    const lang = detectBrowserLanguage()
    setLanguage(lang)
    if (!i18next.isInitialized) {
      i18next.use(initReactI18next).init({
        resources,
        lng: lang,
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
      })
    } else {
      i18next.changeLanguage(lang)
    }
  }, [])

  return <>{children}</>
}

export default I18nProvider
