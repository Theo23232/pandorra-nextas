import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query

  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Invalid URL" })
    return
  }

  try {
    const response = await fetch(url)
    const data = await response.blob()
    res.setHeader("Content-Type", data.type)
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${url.split("/").pop()}`,
    )
    res.send(Buffer.from(await data.arrayBuffer()))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the image" })
  }
}
