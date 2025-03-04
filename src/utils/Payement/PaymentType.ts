export type OrderDetails = {
  identity: string
  name: string
  price: string
  priceDetails?: string
  update: string
}

export const SubscriptionType = [
  {
    identity: "Hebdomadaire",
    name: "Hebdomadaire",
    price: "$ 4,99",
    priceYear: "",
    timelap: "per week",
    timelapYear: "",
    desc: "400 credits/week",
    buttonName: "Subscribe",
  },
  {
    identity: "CreatorPack",
    name: "Creator pack",
    price: "$ 12,99",
    priceYear: "",
    timelap: "per month",
    timelapYear: "",
    desc: "1000 credits/month",
    buttonName: "Subscribe",
  },
  {
    identity: "VisionPro",
    name: "VisionPro",
    price: "$ 34,99",
    priceYear: "",
    timelap: "per month",
    timelapYear: "",
    desc: "3000 credits/month",
    buttonName: "Subscribe",
  },
  {
    identity: "PandorraInfini",
    name: "PandorraInfini",
    price: "$ 89,99",
    priceYear: "",
    timelap: "per month",
    timelapYear: "",
    desc: "8000 credits/month",
    buttonName: "Subscribe",
  },
  {
    identity: "CreatorPackYear",
    name: "CreatorPack",
    price: "$ 142,89",
    priceYear: "",
    timelap: "per year",
    timelapYear: "",
    desc: "1000 credits/month for 1 year",
    buttonName: "Subscribe",
  },
  {
    identity: "PandorraInfiniYear",
    name: "PandorraInfini",
    price: "$ 989.89",
    priceYear: "",
    timelap: "per year",
    timelapYear: "",
    desc: "8000 credits/month for 1 year",
    buttonName: "Subscribe",
  },
]

export const BuyTokenInfo = [
  {
    identity: "1000Tokens",
    type: "imageGenerate",
    name: "1000 Tokens",
    price: "$ 7,99",
    desc: ["Tokens for image generation", "Add 1000 tokens on your account"],
    buttonName: "Buy 1000 tokens",
  },
  {
    identity: "3000Tokens",
    type: "imageGenerate",
    name: "3000 Tokens",
    price: "$ 20,99",
    desc: ["Tokens for image generation", "Add 3000 tokens on your account"],
    buttonName: "Buy 3000 tokens",
  },
  {
    identity: "5000Tokens",
    type: "imageGenerate",
    name: "5000 Tokens",
    price: "$ 29,99",
    desc: ["Tokens for image generation", "Add 5000 tokens on your account"],
    buttonName: "Buy 5000 tokens",
  },
]

export const OrderDetails = [
  {
    identity: "1000Tokens",
    name: "1000 Tokens",
    price: "$ 7,99",
    update: "1000 tokens will be added to your account",
  },
  {
    identity: "3000Tokens",
    name: "3000 Tokens",
    price: "$ 20,99",
    update: "3000 tokens will be added to your account",
  },
  {
    identity: "5000Tokens",
    name: "5000 Tokens",
    price: "$ 29,99",
    update: "5000 tokens will be added to your account",
  },
  {
    identity: "weekly",
    name: "Weekly eco",
    price: "$ 3,99",
    priceDetails: "weekly",
    update: "250 tokens will be added to your account every week",
  },
  {
    identity: "starter",
    name: "Starter Monthly",
    price: "$ 9,99",
    priceDetails: "monthly",
    update: "1000 tokens will be added to your account every month",
  },
  {
    identity: "advancedMonthly",
    name: "Advanced Monthly",
    price: "$ 17,99",
    priceDetails: "monthly",
    update: "2500 tokens will be added to your account every month",
  },
  {
    identity: "advancedAnnual",
    name: "Advanced Monthly",
    price: "$ 172",
    priceDetails: "annual",
    update: "2500 tokens will be added to your account every month",
  },
  {
    identity: "premiumMonthly",
    name: "Premium Monthly",
    price: "$ 32,99",
    priceDetails: "monthly",
    update: "6000 tokens will be added to your account every month",
  },
  {
    identity: "premiumAnnual",
    name: "Premium Monthly",
    price: "$ 316",
    priceDetails: "annual",
    update: "6000 tokens will be added to your account every month",
  },
]
