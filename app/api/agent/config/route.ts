import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { promises as fs } from 'fs'
import path from 'path'

// Agent configuration stored in Supabase
interface AgentConfig {
  name: string
  personality: string
  avatarUrl: string
  voiceEnabled: boolean
  emailAddress: string
  cronEnabled: boolean
  activeWorkflows: string[]
}

// Default configuration
const defaultConfig: AgentConfig = {
  name: 'Sensei',
  personality: 'anime-expert',
  avatarUrl: '/agent/default-avatar.png',
  voiceEnabled: true,
  emailAddress: '',
  cronEnabled: false,
  activeWorkflows: ['daily-inspiration', 'anime-updates'],
}

// GET - Get current agent configuration
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to get config from Supabase
    const { data: configData } = await supabase
      .from('agent_config')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (configData) {
      return NextResponse.json({ config: configData })
    }

    // Return default config if none exists
    return NextResponse.json({ config: defaultConfig })
  } catch (error) {
    console.error('Error getting config:', error)
    return NextResponse.json({ config: defaultConfig })
  }
}

// PUT - Update agent configuration
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    // Validate allowed fields
    const allowedFields = ['name', 'personality', 'avatarUrl', 'voiceEnabled', 'emailAddress', 'cronEnabled', 'activeWorkflows']
    const sanitizedUpdates: Partial<AgentConfig> = {}
    
    for (const key of allowedFields) {
      if (key in updates) {
        sanitizedUpdates[key as keyof AgentConfig] = updates[key]
      }
    }

    // Upsert config
    const { data, error } = await supabase
      .from('agent_config')
      .upsert({
        user_id: user.id,
        ...sanitizedUpdates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      // If table doesn't exist, return success with the updates anyway
      console.error('Supabase error:', error)
      return NextResponse.json({ config: { ...defaultConfig, ...sanitizedUpdates } })
    }

    return NextResponse.json({ config: data })
  } catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
}

// GET soul files
export async function getSoulContent(): Promise<{ soul: string; identity: string; heart: string }> {
  const soulPath = path.join(process.cwd(), 'lib/agent/soul')
  
  try {
    const [soul, identity, heart] = await Promise.all([
      fs.readFile(path.join(soulPath, 'SOUL.md'), 'utf-8'),
      fs.readFile(path.join(soulPath, 'IDENTITY.md'), 'utf-8'),
      fs.readFile(path.join(soulPath, 'HEART.md'), 'utf-8'),
    ])
    
    return { soul, identity, heart }
  } catch {
    return { soul: '', identity: '', heart: '' }
  }
}
