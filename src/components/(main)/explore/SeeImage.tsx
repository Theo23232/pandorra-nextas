import Image from "next/image"
import { ReactNode } from "react"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface SeeImageProps {
  children: ReactNode
  image: string
}

export default function SeeImage(props: SeeImageProps) {
  console.log(props.image)

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-2xl justify-center overflow-hidden border-none bg-transparent p-0 shadow-none">
        <Image
          src={props.image}
          className="max-h-[80vh] w-auto rounded-xl border-none object-contain shadow"
          alt=""
          width="600"
          height="800"
        />
      </DialogContent>
    </Dialog>
  )
}
