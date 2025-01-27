export type OrderDetails = {
  identity: string;
  name: string;
  price: string;
  priceDetails?: string;
  update: string;
};

export const SubscriptionType = [
  {
    identity: 'Free',
    name: 'Free',
    price: 'Free',
    priceYear: '',
    timelap: 'Forever free',
    timelapYear: '',
    desc: '150 Tokens offered at the start',
    buttonName: 'Return to free plan',
  },
  {
    identity: 'WeeklyEco',
    name: 'Weekly eco',
    price: '$ 3,99',
    priceYear: '',
    timelap: 'per week',
    timelapYear: '',
    desc: '250 Tokens offered per week',
    buttonName: 'Subscribe',
  },
  {
    identity: 'StarterMonthly',
    name: 'StarterMonthly',
    price: '$ 9,99',
    priceYear: '',
    timelap: 'per month',
    timelapYear: '',
    desc: '1000 Tokens offered per month',
    buttonName: 'Subscribe',
  },
  {
    identity: 'AdvancedMonthly',
    name: 'AdvancedMonthly',
    price: '$ 17,99',
    priceYear: '$ 172',
    timelap: 'per month',
    timelapYear: 'per year',
    desc: '2500 Tokens offered per month',
    buttonName: 'Subscribe',
  },
  {
    identity: 'PremiumMonthly',
    name: 'PremiumMonthly',
    price: '$ 32,99',
    priceYear: '$ 316',
    timelap: 'per month',
    timelapYear: 'per year',
    desc: '6000 Tokens offered per month',
    buttonName: 'Subscribe',
  },
];

export const BuyTokenInfo = [
  {
    identity: '1000Tokens',
    type: 'imageGenerate',
    name: '1000 Tokens',
    price: '$ 7,99',
    desc: ['Tokens for image generation', 'Add 1000 tokens on your account'],
    buttonName: 'Buy 1000 tokens',
  },
  {
    identity: '3000Tokens',
    type: 'imageGenerate',
    name: '3000 Tokens',
    price: '$ 20,99',
    desc: ['Tokens for image generation', 'Add 3000 tokens on your account'],
    buttonName: 'Buy 3000 tokens',
  },
  {
    identity: '5000Tokens',
    type: 'imageGenerate',
    name: '5000 Tokens',
    price: '$ 29,99',
    desc: ['Tokens for image generation', 'Add 5000 tokens on your account'],
    buttonName: 'Buy 5000 tokens',
  },
];

export const OrderDetails = [
  {
    identity: '1000Tokens',
    name: '1000 Tokens',
    price: '$ 7,99',
    update: '1000 tokens will be added to your account',
  },
  {
    identity: '3000Tokens',
    name: '3000 Tokens',
    price: '$ 20,99',
    update: '3000 tokens will be added to your account',
  },
  {
    identity: '5000Tokens',
    name: '5000 Tokens',
    price: '$ 29,99',
    update: '5000 tokens will be added to your account',
  },
  {
    identity: 'weekly',
    name: 'Weekly eco',
    price: '$ 3,99',
    priceDetails: 'weekly',
    update: '250 tokens will be added to your account every week',
  },
  {
    identity: 'starter',
    name: 'StarterMonthly',
    price: '$ 9,99',
    priceDetails: 'monthly',
    update: '1000 tokens will be added to your account every month',
  },
  {
    identity: 'AdvancedMonthly',
    name: 'AdvancedMonthly',
    price: '$ 17,99',
    priceDetails: 'monthly',
    update: '2500 tokens will be added to your account every month',
  },
  {
    identity: 'advancedAnnual',
    name: 'AdvancedMonthly',
    price: '$ 172',
    priceDetails: 'annual',
    update: '2500 tokens will be added to your account every month',
  },
  {
    identity: 'PremiumMonthly',
    name: 'PremiumMonthly',
    price: '$ 32,99',
    priceDetails: 'monthly',
    update: '6000 tokens will be added to your account every month',
  },
  {
    identity: 'premiumAnnual',
    name: 'PremiumMonthly',
    price: '$ 316',
    priceDetails: 'annual',
    update: '6000 tokens will be added to your account every month',
  },
];
