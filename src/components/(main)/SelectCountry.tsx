import { useTranslation } from "react-i18next"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Country = {
  name: string
  code: string
}

const countries: Country[] = [
  { name: "Allemagne", code: "DE" },
  { name: "Australie", code: "AU" },
  { name: "Autriche", code: "AT" },
  { name: "Belgique", code: "BE" },
  { name: "Bulgarie", code: "BG" },
  { name: "Canada", code: "CA" },
  { name: "Chypre", code: "CY" },
  { name: "Croatie", code: "HR" },
  { name: "Danemark", code: "DK" },
  { name: "Espagne", code: "ES" },
  { name: "Estonie", code: "EE" },
  { name: "États-Unis", code: "US" },
  { name: "Finlande", code: "FI" },
  { name: "France", code: "FR" },
  { name: "Grèce", code: "GR" },
  { name: "Hongrie", code: "HU" },
  { name: "Irlande", code: "IE" },
  { name: "Italie", code: "IT" },
  { name: "Japon", code: "JP" },
  { name: "Lettonie", code: "LV" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lituanie", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Malaisie", code: "MY" },
  { name: "Malte", code: "MT" },
  { name: "Mexique", code: "MX" },
  { name: "Norvège", code: "NO" },
  { name: "Nouvelle-Zélande", code: "NZ" },
  { name: "Pays-Bas", code: "NL" },
  { name: "Pologne", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "République tchèque", code: "CZ" },
  { name: "Roumanie", code: "RO" },
  { name: "Royaume-Uni", code: "GB" },
  { name: "Singapour", code: "SG" },
  { name: "Slovaquie", code: "SK" },
  { name: "Slovénie", code: "SI" },
  { name: "Suède", code: "SE" },
  { name: "Suisse", code: "CH" },
]

interface CountrySelectProps {
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
}
export function SelectCountry({
  onChange = () => {},
  className,
  placeholder = "Country",
}: CountrySelectProps) {
  const { t } = useTranslation()
  return (
    <Select
      onValueChange={(value: string) => {
        console.log("value ==> ", value)
        onChange(value)
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {countries.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {t(c.name)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
