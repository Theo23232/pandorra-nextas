"use server"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

import {
  findUserFromCustomerId,
  increaseReferrerBalance,
} from "@/actions/stripe.actions"
import { prisma } from "@/prisma"

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
      let newPlan = user.plan

      if (!session.subscription) {
        switch (totalAmount) {
          case 1299: // 12,99€
            jetonsToAdd = 1000
            break
          case 3699: // 36,99€
            jetonsToAdd = 3699
            break
          case 9199: // 91,99€
            jetonsToAdd = 9199
            break
          default:
            console.warn("Unrecognized total amount:", totalAmount)
        }
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
        switch (totalAmount) {
          case 499:
            newPlan = "Hebdomadaire"
            jetonsToAdd = 400
            referrerGain = parseFloat(((4.99 * 30) / 100).toFixed(2))
            break
          case 1299:
            newPlan = "CreatorPack"
            jetonsToAdd = 1000
            referrerGain = parseFloat(((12.99 * 30) / 100).toFixed(2))
            break
          case 3699:
            newPlan = "VisionPro"
            jetonsToAdd = 3000
            referrerGain = parseFloat(((36.99 * 30) / 100).toFixed(2))
            break
          case 9199:
            newPlan = "PandorraInfini"
            jetonsToAdd = 8000
            referrerGain = parseFloat(((91.99 * 30) / 100).toFixed(2))
            break
          case 14289:
            newPlan = "CreatorPackYear"
            jetonsToAdd = 1000
            referrerGain = parseFloat(((142.89 * 30) / 100).toFixed(2))
            break
          case 38499:
            newPlan = "VisionProYear"
            jetonsToAdd = 3000
            referrerGain = parseFloat(((384.89 * 30) / 100).toFixed(2))
            break
          case 0:
            newPlan = "PandorraInfiniYear"
            jetonsToAdd = 8000
            referrerGain = parseFloat(((989.89 * 30) / 100).toFixed(2))
            break
          default:
            console.warn("Unrecognized subscription amount:", totalAmount)
        }
      }
      if (user.referreId) {
        await increaseReferrerBalance(user.referreId, referrerGain)

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
