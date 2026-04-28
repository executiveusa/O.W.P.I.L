import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// POST /api/admin/setup
// One-time setup endpoint to create admin user
export async function POST(request: NextRequest) {
  try {
    const setupKey = request.headers.get("x-setup-key")
    
    // Verify setup key matches environment variable
    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { error: "Invalid setup key" },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Create admin user with verified email
    const { data, error } = await supabase.auth.admin.createUser({
      email: "tyshawnmorehed102@proton.me",
      password: "Sheraljean1!",
      email_confirm: true,
      user_metadata: {
        is_admin: true,
        display_name: "Tyshawn",
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: data.user?.id,
        email: data.user?.email,
        is_admin: true,
      },
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Setup failed" },
      { status: 500 }
    )
  }
}
