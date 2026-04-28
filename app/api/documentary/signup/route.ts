import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // Store in Supabase
    const supabase = await createClient()
    const { error } = await supabase
      .from("documentary_signups")
      .insert({ email, signed_up_at: new Date().toISOString() })

    if (error && !error.message.includes("duplicate")) {
      throw error
    }

    // Forward to Tyshawn's email via fetch to Resend
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "OPAL Documentary <noreply@owpil.com>",
          to: ["tyshawnmorehed102@proton.me"],
          subject: "New Documentary Signup",
          text: `New signup for the O.W.P.I.L Documentary:\n\n${email}`,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[documentary/signup]", err)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
