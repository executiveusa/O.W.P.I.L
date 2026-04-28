import { type NextRequest, NextResponse } from 'next/server'
import { youtubeSkills } from '@/lib/agent/skills/built-in/youtube-skills'

// Build a lookup map once
const skillMap = Object.fromEntries(youtubeSkills.map(s => [s.id, s]))

export async function GET(request: NextRequest) {
  const action  = request.nextUrl.searchParams.get('action')
  const videoId = request.nextUrl.searchParams.get('videoId') ?? undefined
  const query   = request.nextUrl.searchParams.get('query')   ?? undefined

  if (!action) {
    return NextResponse.json({
      available: youtubeSkills.map(s => ({ id: s.id, name: s.name, description: s.description })),
    })
  }

  const skill = skillMap[action]
  if (!skill) {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  }

  try {
    const result = await skill.execute({ videoId, query })
    return NextResponse.json({ action, result })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body   = await request.json()
  const action = body.action as string
  const args   = body.args ?? {}

  if (!action) {
    return NextResponse.json({ error: 'action is required' }, { status: 400 })
  }

  const skill = skillMap[action]
  if (!skill) {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  }

  try {
    const result = await skill.execute(args)
    return NextResponse.json({ action, result })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
