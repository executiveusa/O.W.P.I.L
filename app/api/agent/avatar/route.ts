import { put, del, list } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Avatar types available for the agent
const AVATAR_TYPES = ['default', 'happy', 'thinking', 'excited', 'serious', 'custom'] as const
type AvatarType = typeof AVATAR_TYPES[number]

// GET - List all avatars
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { blobs } = await list({ prefix: 'agent-avatars/' })
    
    const avatars = blobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      type: extractAvatarType(blob.pathname),
      uploadedAt: blob.uploadedAt,
      size: blob.size,
    }))

    return NextResponse.json({ avatars })
  } catch (error) {
    console.error('Error listing avatars:', error)
    return NextResponse.json({ error: 'Failed to list avatars' }, { status: 500 })
  }
}

// POST - Upload new avatar
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const avatarType = (formData.get('type') as AvatarType) || 'custom'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
    }

    // Validate avatar type
    if (!AVATAR_TYPES.includes(avatarType)) {
      return NextResponse.json({ error: 'Invalid avatar type' }, { status: 400 })
    }

    // Generate filename with timestamp
    const ext = file.name.split('.').pop() || 'png'
    const filename = `agent-avatars/${avatarType}-${Date.now()}.${ext}`

    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({ 
      url: blob.url,
      pathname: blob.pathname,
      type: avatarType,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// DELETE - Remove avatar
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

function extractAvatarType(pathname: string): AvatarType {
  for (const type of AVATAR_TYPES) {
    if (pathname.includes(`${type}-`)) {
      return type
    }
  }
  return 'custom'
}
