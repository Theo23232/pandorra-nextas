"use client"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"
import { useOnborda } from "onborda"
import React from "react"

import { EditUserTourDone } from "@/actions/user.ations"
// Shadcn
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { CardComponentProps } from "onborda"
export const OnboardaCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  const router = useRouter()

  // Onborda hooks
  const { closeOnborda, startOnborda, currentTour } = useOnborda()

  async function handleConfetti() {
    closeOnborda()
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
    switch (currentTour) {
      case "firsttour":
        EditUserTourDone("firsttour")
        startOnborda("secondtour")
        break
      case "secondtour":
        EditUserTourDone("secondtour")
        startOnborda("thirdtour")
        break
      case "thirdtour":
        EditUserTourDone("thirdtour")
        startOnborda("fourthtour")
        break
      case "fourthtour":
        EditUserTourDone("fourthtour")
        // router.push("/image/generation")
        break
      case "fifthtour":
        EditUserTourDone("fifthtour")
        startOnborda("sixthtour")
        break
      case "sixthtour":
        EditUserTourDone("sixthtour")
        // router.push("/assistant")
        break
      case "seventhtour":
        EditUserTourDone("seventhtour")
        // router.push("/video")
        break
      case "eighthtour":
        EditUserTourDone("eighthtour")
        // router.push("/audio")
        break
      case "ninthtour":
        EditUserTourDone("ninthtour")
        // router.push("/audio/text-to-speech")
        break
      case "tenthtour":
        EditUserTourDone("tenthtour")
        // router.push("/audio/voice-changer")
        break
      case "eleventhtour":
        EditUserTourDone("eleventhtour")
        // router.push("/audio/dubbing")
        break
      case "eleventhtour":
        EditUserTourDone("eleventhtour")
        // router.push("/audio/dubbing")
        break
      case "twelfthtour":
        EditUserTourDone("twelfthtour")
        // router.push("/affiliate")
        break
      case "thirteenthtour":
        EditUserTourDone("thirteenthtour")
        break
      default:
        break
    }
  }

  return (
    <Card className="mt-2 w-[800px] max-w-lg rounded-3xl border-0">
      <CardHeader>
        <div className="flex w-full items-start justify-between">
          <div className="w-full">
            <CardTitle className="mb-2 w-full text-lg">
              {step.icon} {step.title}
            </CardTitle>
            <CardDescription className="w-full">
              {currentStep + 1} of {totalSteps}
            </CardDescription>
          </div>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              closeOnborda()
              EditUserTourDone("stop")
            }}
          >
            <XIcon size={16} />
          </Button> */}
        </div>
      </CardHeader>
      <CardContent className="w-full">{step.content}</CardContent>
      <CardFooter className="w-full">
        <div className="flex w-full justify-between">
          {currentStep !== 0 && (
            <Button onClick={() => prevStep()}>Previous</Button>
          )}
          {currentStep + 1 !== totalSteps && (
            <Button onClick={() => nextStep()} className="ml-auto">
              Next
            </Button>
          )}
          {currentStep + 1 === totalSteps && (
            <Button onClick={() => handleConfetti()} className="ml-auto">
              🎉 Finish!
            </Button>
          )}
        </div>
      </CardFooter>
      <span className="text-card">{arrow}</span>
    </Card>
  )
}
