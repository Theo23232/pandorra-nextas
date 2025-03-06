export const tokenPricesList = [
  {
    creditsCount: 350,
    price: 6,
    priceStripe: 600,
  },
  {
    creditsCount: 700,
    price: 12,
    priceStripe: 1200,
  },
  {
    creditsCount: 1400,
    price: 20,
    isPrime: true,
    priceStripe: 2000,
  },
  {
    creditsCount: 3500,
    price: 50,
    priceStripe: 5000,
  },
  {
    creditsCount: 7000,
    price: 95,
    priceStripe: 9500,
  },
  {
    creditsCount: 14000,
    price: 180,
    priceStripe: 18000,
  },
]

export const subsList = [
  {
    title: "Creator Pack",
    creditsCount: 1000,
    price: 13.8,
    priceStripe: 1380,
    productName: "CreatorPack",
  },
  {
    title: "Pro vision",
    creditsCount: 3000,
    price: 38.8,
    priceStripe: 3880,
    badge: "Best deal",
    isPrime: true,
    productName: "VisionPro",
  },
  {
    title: "Infinite Pandorra",
    creditsCount: 8000,
    price: 96.5,
    priceStripe: 9650,
    badge: "Most popular",
    productName: "PandorraInfini",
  },
]

export const sublistPromo = subsList.map((plan) => ({
  ...plan,
  price: +(plan.price * 0.9).toFixed(2), // Réduction 10% et arrondi à 2 décimales
  priceStripe: Math.round(plan.priceStripe * 0.9), // Réduction 10% et arrondi entier
}))
