import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const PROJECT_ROOT = process.cwd()
const DATA_DIR = path.join(PROJECT_ROOT, 'data')

// Allowed sections - prevents path traversal
const ALLOWED_SECTIONS = ['timeline', 'gallery', 'philosophy', 'hero'] as const
type AllowedSection = typeof ALLOWED_SECTIONS[number]

function isAllowedSection(section: string): section is AllowedSection {
  return ALLOWED_SECTIONS.includes(section as AllowedSection)
}

interface ContentData {
  timeline?: {
    past: TimelineEntry[]
    present: TimelineEntry[]
    future: TimelineEntry[]
  }
  gallery?: GalleryImage[]
  philosophy?: Belief[]
  hero?: HeroContent
}

interface TimelineEntry {
  title: string
  description: string
  year?: string
  image?: string
}

interface GalleryImage {
  url: string
  alt: string
  category: string
  location?: string
}

interface Belief {
  title: string
  description: string
  icon?: string
}

interface HeroContent {
  tagline: string
  subtitle: string
  images: Array<{ url: string; alt: string }>
}

// Auth check helper
async function requireAuth(): Promise<{ authorized: boolean; error?: Response }> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return {
      authorized: false,
      error: new Response(
        JSON.stringify({ error: 'Unauthorized - please sign in' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
  
  return { authorized: true }
}

// Get content data
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const section = searchParams.get('section') || 'all'

  // Validate section parameter
  if (section !== 'all' && !isAllowedSection(section)) {
    return new Response(
      JSON.stringify({ error: 'Invalid section' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const result: ContentData = {}

    if (section === 'all' || section === 'timeline') {
      try {
        const data = await fs.readFile(path.join(DATA_DIR, 'timeline.json'), 'utf-8')
        result.timeline = JSON.parse(data)
      } catch {
        result.timeline = { past: [], present: [], future: [] }
      }
    }

    if (section === 'all' || section === 'gallery') {
      try {
        const data = await fs.readFile(path.join(DATA_DIR, 'gallery.json'), 'utf-8')
        result.gallery = JSON.parse(data)
      } catch {
        result.gallery = []
      }
    }

    if (section === 'all' || section === 'philosophy') {
      try {
        const data = await fs.readFile(path.join(DATA_DIR, 'philosophy.json'), 'utf-8')
        result.philosophy = JSON.parse(data)
      } catch {
        result.philosophy = []
      }
    }

    if (section === 'all' || section === 'hero') {
      try {
        const data = await fs.readFile(path.join(DATA_DIR, 'hero.json'), 'utf-8')
        result.hero = JSON.parse(data)
      } catch {
        result.hero = {
          tagline: 'One Without Purpose Is Lost',
          subtitle: 'Tyshawn • The Paulie Effect',
          images: [],
        }
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to read content' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Update content data (requires auth)
export async function POST(req: Request) {
  // Require authentication
  const auth = await requireAuth()
  if (!auth.authorized) return auth.error!

  try {
    const { section, data } = await req.json()

    if (!section || !data) {
      return new Response(
        JSON.stringify({ error: 'Section and data required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate section against allowlist
    if (!isAllowedSection(section)) {
      return new Response(
        JSON.stringify({ error: 'Invalid section' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })

    const filePath = path.join(DATA_DIR, `${section}.json`)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return new Response(
      JSON.stringify({ success: true, section, message: `${section} updated successfully` }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to update content' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Delete content (requires auth)
export async function DELETE(req: Request) {
  // Require authentication
  const auth = await requireAuth()
  if (!auth.authorized) return auth.error!

  const { searchParams } = new URL(req.url)
  const section = searchParams.get('section')
  const index = searchParams.get('index')

  if (!section) {
    return new Response(
      JSON.stringify({ error: 'Section required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Validate section against allowlist
  if (!isAllowedSection(section)) {
    return new Response(
      JSON.stringify({ error: 'Invalid section' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const filePath = path.join(DATA_DIR, `${section}.json`)
    
    if (index !== null) {
      // Delete specific item from array
      const data = await fs.readFile(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      
      if (Array.isArray(parsed)) {
        const idx = parseInt(index)
        if (isNaN(idx) || idx < 0 || idx >= parsed.length) {
          return new Response(
            JSON.stringify({ error: 'Invalid index' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
        parsed.splice(idx, 1)
        await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8')
      }
    } else {
      // Reset section to empty
      const emptyData = section === 'timeline' 
        ? { past: [], present: [], future: [] }
        : []
      await fs.writeFile(filePath, JSON.stringify(emptyData, null, 2), 'utf-8')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Content deleted' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to delete content' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
