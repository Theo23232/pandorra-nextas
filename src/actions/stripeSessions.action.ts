"use server"
import { redirect } from 'next/navigation';

import { createProductPayement, createProductSubscription } from '@/actions/stripe.actions';
import { currentUser } from '@/lib/current-user';
import { SA } from '@/lib/safe-ation';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/prisma';

export const subscriptionSession = async (
  productName: string,
  productDesc: string,
  productAmount: number,
  subsInterval: "week" | "month" | "year",
) => {
  const user = await currentUser()

  if (!user) {
    throw new Error("User not found")
  }

  const stripeCustomerId = user?.stripeCustomerId ?? ""

  if (!stripeCustomerId) {
    throw new Error("Stripe customer ID is missing")
  }

  const priceId = await createProductSubscription(
    productName,
    productDesc,
    productAmount,
    subsInterval,
  )

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId as string,
    allow_promotion_codes: true,
    mode: "subscription",
    payment_method_types: ["card", "link"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT}`,
    cancel_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT}`,
  })
  if (!session.url) {
    throw new Error("Session URL is missing")
  }
  console.log("session.url ==> ", session.url)
  redirect(session.url)
}

export const subscriptionZeroSession = async (
) => {
  const user = await currentUser()

  if (!user) {
    throw new Error("User not found")
  }

  const stripeCustomerId = user?.stripeCustomerId ?? ""

  if (!stripeCustomerId) {
    throw new Error("Stripe customer ID is missing")
  }




  const price = await stripe.prices.create({
    product: 'prod_S1OW42XSAqJhzY',
    unit_amount: 100,
    currency: "usd",
    recurring: {
      interval: 'year'
    }
  })

  const priceId = price.id

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId as string,
    allow_promotion_codes: true,
    mode: "subscription",
    payment_method_types: ["card", "link"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT}`,
    cancel_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT}`,
  })
  if (!session.url) {
    throw new Error("Session URL is missing")
  }
  console.log("session.url ==> ", session.url)
  redirect(session.url)
}

export const payementSession = async (
  productName: string,
  productDesc: string,
  productAmount: number,
) => {
  const user = await currentUser()

  if (!user) {
    throw new Error("User not found")
  }

  const stripeCustomerId = user?.stripeCustomerId ?? ""

  if (!stripeCustomerId) {
    throw new Error("Stripe customer ID is missing")
  }

  const priceId = await createProductPayement(
    productName,
    productDesc,
    productAmount,
  )

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "payment",
    payment_method_types: ["card", "link"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT}`,
    cancel_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT}`,
  })
  if (!session.url) {
    throw new Error("Session URL is missing")
  }
  redirect(session.url)
}

export const accountSettingSession = async () => {
  const user = await currentUser()

  if (!user) {
    throw new Error("User not found")
  }

  const stripeCustomerId = user?.stripeCustomerId

  if (!stripeCustomerId) {
    throw new Error("Stripe customer ID is missing")
  }

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId ?? "",
    return_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT}`,
  })

  if (!stripeSession.url) {
    throw new Error("Session URL is missing")
  }
  redirect(stripeSession.url)
}

export const autoRenewSubscription = async (inactiveRenew: boolean) => {
  const user = await currentUser()

  if (!user) {
    throw new Error("User not found")
  }

  const stripeCustomerId = user?.stripeCustomerId

  if (!stripeCustomerId) {
    throw new Error("Stripe customer is missing")
  }

  const subscription = await stripe.subscriptions.list({
    customer: stripeCustomerId,
  })

  if (subscription.data.length === 0) {
    throw new Error("No subscriptions found for this customer.")
  }
  const subscriptionId = await stripe.subscriptions.retrieve(
    subscription.data[0].id,
  )

  await stripe.subscriptions.update(subscriptionId.id, {
    cancel_at_period_end: inactiveRenew,
  })
}

export const getSubscriptionState = async () => {
  try {
    const user = await currentUser()
    const stripeCustomerId = user?.stripeCustomerId

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId ?? "",
    })

    const isSubscriptionCanceled = subscriptions.data[0].cancel_at_period_end
    let subscriptionState = ""
    if (isSubscriptionCanceled) {
      subscriptionState = "canceled"
    }

    return subscriptionState
  } catch (error) {
    console.log(error)
  }
}


export const verifyCardForFreePlan = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  // Créer ou récupérer un customer Stripe
  let stripeCustomerId = user.stripeCustomerId;

  if (!stripeCustomerId) {
    // Créer un nouveau customer Stripe si nécessaire
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.username || undefined,
      metadata: {
        userId: user.id,
      },
    });

    stripeCustomerId = customer.id;

    // Sauvegarder l'ID du customer
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }
  const setupIntent = await stripe.setupIntents.create({
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    usage: "off_session", // Pour utilisation future
    metadata: {
      userId: user.id,
      purpose: "free_plan_verification",
    },
  });
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "setup",
    payment_method_types: ["card"],
    setup_intent_data: {
      metadata: {
        userId: user.id,
        purpose: "free_plan_verification",
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT}?success=verification`,
    cancel_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT}?canceled=true`,
  });

  if (!session.url) {
    throw new Error("Session URL is missing");
  }

  redirect(session.url);
};

// Add this function to your existing actions file


export const saveCancellationReason = SA(async (user, reason: string, details?: string): Promise<null> => {
  await prisma.feedback.create({
    data: {
      userId: user.id,
      feedbackType: "subscription_cancellation",
      message: reason + (details ? `: ${details}` : ""),
      createdAt: new Date(),
      rating: 0,
    }
  });
  return null
})
