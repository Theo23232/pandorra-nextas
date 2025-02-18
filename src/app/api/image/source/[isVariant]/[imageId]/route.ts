import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/prisma"

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const imageId = searchParams.get("imageId")
  const isVariant = searchParams.get("isVariant")
  try {
    if (!imageId || !isVariant) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      )
    }

    if (isVariant === "false") {
      const userImage = await prisma.userImage.findFirstOrThrow({
        where: {
          id: imageId,
        },
      })
      const generatedImage = await prisma.generatedImage.findFirstOrThrow({
        where: {
          url: userImage.imageUrl,
        },
        select: {
          Generation: true,
        },
      })

      const generation = await prisma.generation.findFirstOrThrow({
        where: {
          id: generatedImage.Generation?.id,
        },
        include: {
          generated_images: true,
        },
      })

      return NextResponse.json(generation, { status: 200 })
    } else {
      const variant = await prisma.variant.findFirstOrThrow({
        where: { variantId: imageId },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          original: true,
          variant: true,
        },
      })
      return NextResponse.json(variant, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ status: 500 })
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
