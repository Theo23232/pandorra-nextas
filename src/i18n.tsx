"use client"
import i18next from 'i18next';
import { useEffect } from 'react';
import { initReactI18next } from 'react-i18next';

import translationEnglish from './translation/en.json';
import translationEspania from './translation/es.json';
import translationFrench from './translation/fr.json';
import translationItalian from './translation/ita.json';

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
    return ["fr", "en", "it", "es"].includes(browserLang) ? browserLang : "fr"
  }
  return "fr" // Valeur par défaut pour le serveur
}

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    lng: detectBrowserLanguage(),
  })
}

export const useI18n = () => {
  useEffect(() => {
    const browserLang = detectBrowserLanguage()
    if (i18next.language !== browserLang) {
      i18next.changeLanguage(browserLang)
    }
  }, [])

  return i18next
}

export default i18next
