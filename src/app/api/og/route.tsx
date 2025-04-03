import { ImageResponse } from 'next/og';

import { getPublicationById } from '@/actions/publication.action';

import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              fontSize: 60,
              color: "white",
              background: "linear-gradient(to bottom, #030014, #1e1b29)",
              width: "100%",
              height: "100%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 80, fontWeight: "bold" }}>
                Pandorra.ai
              </div>
              <div style={{ fontSize: 40 }}>Create amazing AI images</div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      )
    }

    const publication = await getPublicationById(id)

    if (!publication) {
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              fontSize: 60,
              color: "white",
              background: "linear-gradient(to bottom, #030014, #1e1b29)",
              width: "100%",
              height: "100%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>Publication not found</div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      )
    }

    // Fetch the image
    const imageResponse = await fetch(publication.imageUrl)

    // Get the image as a buffer and convert to base64 for use in img src
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = `data:${imageResponse.headers.get("content-type") || "image/png"};base64,${Buffer.from(imageBuffer).toString("base64")}`

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontSize: 60,
            color: "white",
            background: "linear-gradient(to bottom, #030014, #1e1b29)",
            width: "100%",
            height: "100%",
            padding: 50,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              padding: 50,
            }}
          >
            <img
              src={base64Image || "/placeholder.svg"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              alt={publication.prompt}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              zIndex: 10,
              background: "rgba(0, 0, 0, 0.7)",
              padding: 20,
              borderRadius: 15,
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 10 }}>
              {publication.prompt.length > 100
                ? publication.prompt.substring(0, 97) + "..."
                : publication.prompt}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 24,
              }}
            >
              <div>Created with Pandorra.ai</div>
              <div>by {publication.user.username || "Pandorra User"}</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("Error generating OG image:", error)
    return new Response("Error generating image", { status: 500 })
  }
}
