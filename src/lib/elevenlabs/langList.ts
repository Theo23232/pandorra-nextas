export const languageOptions = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "bg", label: "Български" },
  { code: "zh", label: "中文" },
  { code: "hr", label: "Hrvatski" },
  { code: "da", label: "Dansk" },
  { code: "de", label: "Deutsch" },
  { code: "el", label: "Ελληνικά" },
  { code: "hi", label: "हिन्दी" },
  { code: "it", label: "Italiano" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "pl", label: "Polski" },
  { code: "pt", label: "Português" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "ro", label: "Română" },
  { code: "ru", label: "Русский" },
  { code: "es", label: "Español" },
  { code: "sk", label: "Slovenčina" },
  { code: "sv", label: "Svenska" },
  { code: "tr", label: "Türkçe" },
  { code: "uk", label: "Українська" },
]

export const getLangageNameByCode = (code: string): string => {
  const voice = languageOptions.find((lang) => lang.code === code)
  return voice ? voice.label : "Unknown"
}
