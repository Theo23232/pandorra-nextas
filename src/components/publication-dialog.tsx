"use client"

import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { Publication } from '@prisma/client';

interface PublicationDialogProps {
  publication: Publication // Replace with your actual publication type
  isOpen: boolean
  onClose: () => void
}

export const PublicationDialog = ({
  publication,
  isOpen,
  onClose,
}: PublicationDialogProps) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { user } = useUser()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyLink = () => {
    // Assuming publication has an id or slug that can be used in the URL
    const publicationUrl = `https://pandorra.ai/share?id=${publication?.id}&referrer=${user?.id}`
    navigator.clipboard.writeText(publicationUrl)
    setIsCopied(true)

    toast({
      title: t("Success"),
      description: t("Link copied to clipboard"),
      variant: "success",
      duration: 3000,
    })

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const handleShare = async () => {
    const publicationUrl = `https://pandorra.ai/share?id=${publication?.id}&referrer=${user?.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: publication.prompt || t("My AI Image"),
          text: t("Check out this AI-generated image!"),
          url: publicationUrl,
        })

        toast({
          title: t("Success"),
          description: t("Content shared successfully"),
          variant: "success",
          duration: 3000,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopyLink()
    }
  }

  useEffect(() => {
    console.log("here")
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden border-none bg-gradient-to-br from-[#030014] to-[#1e1b29] p-0 text-white">
        <div className="relative flex flex-col items-center p-6 pb-4">
          {/* Title */}
          <h2 className="text-center text-4xl font-semibold">
            Share your creation
          </h2>
          <h2 className="mb-6 text-center text-4xl font-semibold">
            and earn credits!
          </h2>

          {/* Credits info */}
          <p className="mb-8 text-center">
            Earn <span className="font-bold">10 credits</span> if someone signs
            up using your share link
          </p>

          {/* Image display */}
          <div className="relative mb-6 flex w-full overflow-hidden rounded-xl">
            {/* Main image */}
            {publication?.imageUrl && (
              <div className="flex-1 overflow-hidden rounded-lg">
                <Image
                  src={
                    publication?.imageUrl ||
                    "/placeholder.svg?height=400&width=400"
                  }
                  alt={publication?.prompt || "AI generated image"}
                  width={500}
                  height={400}
                  className="mb-2 h-full max-h-[40vh] w-full overflow-hidden rounded-lg bg-muted object-cover p-2"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex w-full gap-2">
            <Button
              onClick={handleCopyLink}
              variant={"ghost"}
              className="flex-1 rounded-full bg-white py-4 font-medium text-black hover:bg-gray-200 hover:text-black"
            >
              Copy link and share
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full bg-white p-4 text-black hover:bg-gray-200 hover:text-black"
                >
                  <MoreVertical className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://pandorra.ai/share?id=${publication?.id}&referrer=${user?.id}`)}&text=${encodeURIComponent("Check out this amazing AI-generated image!")}`,
                      "_blank",
                    )
                  }
                >
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://pandorra.ai/share?id=${publication?.id}&referrer=${user?.id}`)}`,
                      "_blank",
                    )
                  }
                >
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://pandorra.ai/share?id=${publication?.id}&referrer=${user?.id}`)}&title=${encodeURIComponent("Amazing AI-generated image")}`,
                      "_blank",
                    )
                  }
                >
                  Share on LinkedIn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
