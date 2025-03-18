"use client"
import i18next from "i18next"
import { useEffect } from "react"
import { initReactI18next } from "react-i18next"

import { editLangange } from "@/actions/user.ations"
import { useUser } from "@/hooks/use-user"

import translationEnglish from "./translation/en.json"
import translationEspania from "./translation/es.json"
import translationFrench from "./translation/fr.json"
import translationItalian from "./translation/ita.json"
import translationPortuguese from "./translation/pt.json"

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
  pt: {
    translation: translationPortuguese,
  },
}
const edit = async (lang: string) => {
  await editLangange(lang)
  window.location.reload()
}

const detectBrowserLanguage = (): string => {
  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    const localLang = localStorage.getItem("lang")
    const browserLang = navigator.language.substring(0, 2).toLowerCase()
    const lang = ["fr", "en", "it", "es", "pt"].includes(browserLang)
      ? browserLang
      : "en"
    if (localLang) {
      if (localLang == "unknown") {
        edit(lang)
        return lang
      } else {
        return localLang
      }
    } else {
      return lang
    }
  } else {
    return "en" // Valeur par défaut pour le serveur
  }
}

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    lng: detectBrowserLanguage(),
  })
}

export const useI18n = () => {
  const { user } = useUser()

  useEffect(() => {
    const browserLang = detectBrowserLanguage()
    if (i18next.language !== browserLang) {
      i18next.changeLanguage(browserLang)
    }
  }, [user])

  return i18next
}

export default i18next
