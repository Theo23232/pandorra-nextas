"use client"
import { CheckIcon } from 'lucide-react';

import { payementSession } from '@/actions/stripeSessions.action';
import { Button } from '@/components/tremor/ui/button';
import { Card, CardContent } from '@/components/tremor/ui/card';
import { Badge } from '@/components/ui/badge';

interface CardPayementProps {
  identity: string
  type: string
  name: string
  price: string
  desc: string[]
  buttonName: string
}

export const CardPayement = (props: CardPayementProps) => {
  const handleButtonClick = async () => {
    switch (props.identity) {
      case "1000Tokens":
        await payementSession(
          "1000 Tokens",
          "Purchase 1000 Tokens on Pandorra",
          799,
        )
        localStorage.setItem("article", "1000Tokens")
        break
      case "3000Tokens":
        await payementSession(
          "3000 Tokens",
          "Purchase 3000 Tokens on Pandorra",
          2099,
        )
        localStorage.setItem("article", "3000Tokens")
        break
      case "5000Tokens":
        await payementSession(
          "5000 Tokens",
          "Purchase 5000 Tokens on Pandorra",
          2999,
        )
        localStorage.setItem("article", "5000Tokens")
        break
      default:
        break
    }
  }

  const formatString = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "_")
  }

  return (
    <Card className="min-w-[356px] max-w-[356px] bg-muted/50 text-black dark:text-white">
      <div className="flex flex-col items-center justify-center">
        <Badge className="mb-4 w-max self-center">
          {formatString(props.name)}
        </Badge>
        <span className="text-5xl font-bold text-black dark:text-white">
          {props.price}
        </span>
      </div>
      <CardContent>
        <ul className="mt-7 space-y-2.5 text-sm">
          {props.desc.map((description) => (
            <li
              key={description}
              className="flex space-x-2 text-black dark:text-white"
            >
              <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span key={description}>{formatString(description)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <Button
        className="w-full text-black hover:text-black dark:text-white hover:dark:text-white"
        variant="outline"
        onClick={() => handleButtonClick()}
      >
        {formatString(props.buttonName)}
      </Button>
    </Card>
  )
}
