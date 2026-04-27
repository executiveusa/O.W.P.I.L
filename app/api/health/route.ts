import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      app: true,
      supabase: false,
      openrouter: false,
    },
    version: '1.0.0',
  }

  // Check Supabase connection
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('_health_check').select('*').limit(1).maybeSingle()
    // If error is "relation does not exist", that's fine - Supabase is working
    health.services.supabase = !error || error.code === '42P01'
  } catch {
    health.services.supabase = false
  }

  // Check OpenRouter API key is configured
  health.services.openrouter = !!process.env.OPENROUTER_API_KEY

  // Overall status
  const allHealthy = Object.values(health.services).every(Boolean)
  health.status = allHealthy ? 'healthy' : 'degraded'

  return NextResponse.json(health, {
    status: allHealthy ? 200 : 503,
  })
}
