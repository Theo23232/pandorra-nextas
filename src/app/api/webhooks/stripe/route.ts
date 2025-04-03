"use server"
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { findUserFromCustomerId, increaseReferrerBalance } from '@/actions/stripe.actions';
import { subsList, tokenPricesList } from '@/lib/prices';
import { prisma } from '@/prisma';
import { Plan, User } from '@prisma/client';

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

      tokenPricesList.forEach(async (t) => {
        if (t.priceStripe == totalAmount) {
          jetonsToAdd = t.creditsCount
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
        }
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
      const threshold = 0.01

      const totalAmount = invoice.amount_paid
      let jetonsToAdd = 0
      let newPlan = user.plan
      let referrerGain = 0


      await validateSubscribe(
        user,
        0,
        `FreePaid` as Plan,
        0,
        30,
      )

      if (invoice.subscription) {
        subsList.forEach(async (t) => {
          if (
            t.priceStripe == totalAmount ||
            Math.abs(t.priceStripe * 0.9 - totalAmount) < threshold
          ) {
            jetonsToAdd = t.creditsCount - 30
            newPlan = t.productName as Plan
            referrerGain = parseFloat(((t.price * 30) / 100).toFixed(2))
            await validateSubscribe(
              user,
              referrerGain,
              newPlan,
              totalAmount,
              jetonsToAdd,
            )
          } else if (
            t.priceStripe * 11 == totalAmount ||
            Math.abs(t.priceStripe * 11 * 0.9 - totalAmount) < threshold
          ) {
            jetonsToAdd = (t.creditsCount - 30) * 12
            newPlan = `${t.productName}Year` as Plan
            referrerGain = parseFloat(((t.price * 30 * 11) / 100).toFixed(2))
            await validateSubscribe(
              user,
              referrerGain,
              newPlan,
              totalAmount,
              jetonsToAdd,
            )
          }
        })
      }

      if (totalAmount == 580 || totalAmount == 522) {
        jetonsToAdd = 350 - 30
        newPlan = Plan.Hebdomadaire
        referrerGain = parseFloat(((5.8 * 30) / 100).toFixed(2))
        await validateSubscribe(
          user,
          referrerGain,
          newPlan,
          totalAmount,
          jetonsToAdd,
        )
      }

      console.log("Checkout invoice completed", invoice)
      break
    }

    case "customer.subscription.updated": {
      const subscription = body.data.object as Stripe.Subscription
      const stripeCustomerId = subscription.customer
      const user = await findUserFromCustomerId(stripeCustomerId)
      if (!user?.id) {
        break
      }

      // Check if the subscription status indicates it's ending
      if (
        subscription.status === "canceled" ||
        subscription.cancel_at_period_end === true
      ) {
        await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            plan: "FreePaid",
          },
        })
        console.log("Subscription set to cancel at period end", subscription)
      } else {
        let jetonsToAdd = 0
        let newPlan = user.plan

        if (
          subscription.status === "active" &&
          subscription.current_period_start !== subscription.created
        ) {
          // Find the last subscription to get the price
          const lastSub = await prisma.subscribe.findFirst({
            where: {
              userId: user.id,
            },
            orderBy: {
              createdAt: "desc",
            },
          })

          // Check if a similar subscription already exists recently
          const existingSubscription = await prisma.subscribe.findFirst({
            where: {
              userId: user.id,
              plan: newPlan,
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
              }
            }
          });

          if (!existingSubscription) {
            await validateSubscribe(
              user,
              0, // No referrer gain on renewal
              newPlan,
              lastSub?.price || 0,
              jetonsToAdd,
            )
          }
        }

        // Update user plan and jetons if needed
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
      }
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
          plan: "FreePaid",
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

    case "invoice.payment_action_required": {
      const invoice = body.data.object as Stripe.Invoice
      const stripeCustomerId = invoice.customer
      const user = await findUserFromCustomerId(stripeCustomerId)
      if (!user?.id) {
        break
      }

      // TODO: You might want to notify the user here that payment action is required
      console.log("Payment action required for invoice", invoice)
      break
    }

    case "setup_intent.succeeded": {
      const setupIntent = body.data.object as Stripe.SetupIntent;

      // Vérifier que c'est bien pour notre vérification de plan gratuit
      if (setupIntent.metadata?.purpose === "free_plan_verification") {
        const stripeCustomerId = setupIntent.customer as string;
        const user = await findUserFromCustomerId(stripeCustomerId);

        if (!user?.id) {
          break;
        }

        // Mettre à jour l'utilisateur avec le plan FreePaid et les jetons gratuits
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            plan: Plan.FreePaid,
            jeton: {
              increment: 30, // Ajouter les 30 jetons gratuits
            },
          },
        });

        // Enregistrer cette attribution de jetons
        await prisma.subscribe.create({
          data: {
            userId: user.id,
            plan: Plan.FreePaid,
            price: 0, // Prix à 0 car c'est gratuit
          },
        });

        console.log("Card verified for free plan:", setupIntent.id);
      }
      break;
    }


    default: {
      console.log("Unhandled event type", body.type)
    }
  }
  return NextResponse.json({
    ok: true,
  })
}

const validateSubscribe = async (
  user: User,
  referrerGain: number,
  newPlan: Plan,
  totalAmount: number,
  jetonsToAdd: number,
) => {
  if (user.referreId) {

    const existingSubscription = await prisma.subscribe.findFirst({
      where: {
        userId: user.id,
        plan: newPlan,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    if (!existingSubscription) {
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


  } else {
    const existingSubscription = await prisma.subscribe.findFirst({
      where: {
        userId: user.id,
        plan: newPlan,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    if (!existingSubscription) {

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
  }

}
