"use server"

import { currentUser } from "@/lib/current-user"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/prisma"

export const createProductPayement = async (
  name: string,
  description: string,
  price: number,
) => {
  try {
    const product = await stripe.products.create({
      name: name,
      description: description,
      active: true,
    })
    const createdPrice = await stripe.prices.create({
      unit_amount: price,
      currency: "eur",
      product: product.id,
    })

    return createdPrice.id
  } catch (error) {
    throw new Error("Failed to create product and price")
  }
}

export async function createProductSubscription(
  name: string,
  description: string,
  amount: number,
  interval: "week" | "month" | "year",
) {
  const product = await stripe.products.create({
    name,
    description,
  })

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency: "eur",
    recurring: {
      interval,
    },
  })

  return price.id
}

export const findUserFromCustomerId = async (stripeCustomerId: unknown) => {
  if (typeof stripeCustomerId !== "string") {
    return null
  }
  return prisma.user.findFirst({
    where: {
      stripeCustomerId,
    },
  })
}

export const createStripeConnect = async (country: string) => {
  try {
    const user = await currentUser()
    const account = await stripe.accounts.create({
      type: "express",
      country,
      business_type: "individual",
    })
    const accountId = account.id

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        connectStripeId: accountId,
      },
    })

    return account.id
  } catch (error) {
    console.error("Error creating account:", error)
  }
}

export const createLinkOnBoarding = async (accountId: string) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "http://localhost:3000/affiliate",
      return_url: "http://localhost:3000/affiliate",
      type: "account_onboarding",
    })

    return accountLink.url
  } catch (error) {
    console.error("Error creating account:", error)
  }
}

export const withdrawMoney = async (accountId: string, amount: number) => {
  try {
    const user = await currentUser()

    if (user) {
      const stripeConnectAccount = await stripe.accounts.retrieve(accountId)

      if (!stripeConnectAccount) {
        throw new Error("Account stripe connect is not found")
      }

      // const currency = stripeConnectAccount.default_currency;

      // if (!currency) {
      //   throw new Error('No currency found for this Stripe account');
      // }

      await stripe.payouts.create({
        amount: Math.round(amount * 100),
        currency: "eur",
        destination: accountId,
      })

      const newBalance = (parseFloat(user.currentAmount) - amount).toFixed(2)

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          currentAmount: newBalance.toString(),
        },
      })
    }
  } catch (error) {
    console.error("Withdrawal error:", error)
  }
}

export const increaseReferrerBalance = async (
  referrerId: string,
  amount: number,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: referrerId },
    })

    if (user) {
      const accumulatedTotal = parseFloat(user.amountAccumulated) + amount
      const currentTotal = parseFloat(user.currentAmount) + amount

      await prisma.user.update({
        where: {
          id: referrerId,
        },
        data: {
          amountAccumulated: accumulatedTotal.toString(),
          currentAmount: currentTotal.toString(),
        },
      })
    }
  } catch (error) {
    console.error(error)
  }
}
