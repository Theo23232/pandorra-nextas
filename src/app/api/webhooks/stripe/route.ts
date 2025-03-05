"use server"
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { findUserFromCustomerId, increaseReferrerBalance } from '@/actions/stripe.actions';
import { subsList, tokenPricesList } from '@/lib/prices';
import { prisma } from '@/prisma';
import { Plan } from '@prisma/client';

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as Stripe.Event

  switch (body.type) {
    case "checkout.session.completed": {
      const session = body.data.object as Stripe.Checkout.Session
      const stripeCustomerId = session.customer
      const user = await findUserFromCustomerId(stripeCustomerId)
      if (!user?.id) {
        break
      }

      const totalAmount = session.amount_total
      let jetonsToAdd = 0

      tokenPricesList.forEach((t) => {
        if (t.priceStripe == totalAmount) {
          jetonsToAdd = t.creditsCount
        }
      })

      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          jeton: {
            increment: jetonsToAdd,
          },
        },
      })
      await prisma.buyToken.create({
        data: {
          userId: user.id,
          amount: jetonsToAdd,
          price: totalAmount || 0,
        },
      })
      console.log("Checkout session completed", session)
      break
    }

    case "invoice.paid": {
      const invoice = body.data.object as Stripe.Invoice
      const stripeCustomerId = invoice.customer
      const user = await findUserFromCustomerId(stripeCustomerId)
      if (!user?.id) {
        break
      }

      const totalAmount = invoice.amount_paid
      let jetonsToAdd = 0
      let newPlan = user.plan
      let referrerGain = 0

      if (invoice.subscription) {
        subsList.forEach((t) => {
          if (t.priceStripe == totalAmount) {
            jetonsToAdd = t.creditsCount
            newPlan = t.productName as Plan
            referrerGain = parseFloat((t.price / 100).toFixed(2))
          } else if (t.priceStripe * 11 == totalAmount) {
            jetonsToAdd = t.creditsCount
            newPlan = `${t.productName}Year` as Plan
            referrerGain = parseFloat(((t.price * 11) / 100).toFixed(2))
          }
        })
      }

      if (user.referreId) {
        await increaseReferrerBalance(user.referreId, referrerGain)

        await prisma.affiliation.create({
          data: {
            userId: user.id,
            parentId: user.referreId,
            plan: newPlan,
            price: totalAmount,
          },
        })

        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            referreId: "",
          },
        })
      }

      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          jeton: {
            increment: jetonsToAdd,
          },
          plan: newPlan,
        },
      })
      await prisma.subscribe.create({
        data: {
          userId: user.id,
          plan: newPlan,
          price: totalAmount,
        },
      })
      console.log("Checkout invoice completed", invoice)
      break
    }

    case "invoice.payment_failed": {
      const invoice = body.data.object as Stripe.Invoice
      const stripeCustomerId = invoice.customer
      const user = await findUserFromCustomerId(stripeCustomerId)
      if (!user?.id) {
        break
      }

      let newPlan = user.plan

      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          plan: newPlan,
        },
      })
      console.log("Invoice event", body.type, invoice)
      break
    }

    case "customer.subscription.deleted": {
      const subscription = body.data.object as Stripe.Subscription
      const stripeCustomerId = subscription.customer
      const user = await findUserFromCustomerId(stripeCustomerId)
      if (!user?.id) {
        break
      }

      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          plan: "Free",
        },
      })
      console.log("Invoice event", body.type, subscription)
      break
    }
    case "transfer.created":
      const transferCreated = body.data.object as Stripe.Transfer
      console.log("Transfer created: ", transferCreated)
      break

    case "payout.created":
      const payoutCreated = body.data.object as Stripe.Payout
      break

    case "payout.failed":
      const payoutFailed = body.data.object as Stripe.Payout
      console.log("Payout échoué:", payoutFailed)

      break

    default: {
      console.log("Unhandled event type", body.type)
    }
  }
  return NextResponse.json({
    ok: true,
  })
}
