import { OAuth2Client } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  )

  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  try {
    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code)

    // Verify ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    // Redirect to a success page or dashboard
    return NextResponse.redirect(new URL("/explore", request.url))
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    )
  }
}
