import { getBrowserController, hasExistingSession } from '@/lib/agent/browser/controller'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// Auth check helper
async function requireAuth(): Promise<{ authorized: boolean; userId?: string; error?: Response }> {
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
  
  return { authorized: true, userId: user.id }
}

// Browser control actions (requires auth)
export async function POST(req: Request) {
  // Require authentication
  const auth = await requireAuth()
  if (!auth.authorized) return auth.error!

  try {
    const { action, sessionId, ...params } = await req.json()
    
    // Scope session to authenticated user
    const userSessionId = sessionId ? `${auth.userId}-${sessionId}` : auth.userId
    const controller = await getBrowserController(userSessionId)
    
    let result: unknown
    
    switch (action) {
      case 'navigate':
        result = await controller.navigate(params.url)
        break
        
      case 'click':
        result = await controller.click(params.selector)
        break
        
      case 'type':
        result = await controller.type(params.selector, params.text)
        break
        
      case 'screenshot':
        result = await controller.screenshot()
        break
        
      case 'content':
        result = await controller.getContent()
        break
        
      case 'execute':
        result = await controller.executeScript(params.script)
        break
        
      case 'back':
        result = await controller.goBack()
        break
        
      case 'forward':
        result = await controller.goForward()
        break
        
      case 'reload':
        result = await controller.reload()
        break
        
      case 'close':
        await controller.close()
        result = { success: true, message: 'Session closed' }
        break
        
      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionId: controller.getSessionId(),
        result,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Browser control error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Browser action failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Get session status (requires auth, doesn't create new session)
export async function GET(req: Request) {
  // Require authentication
  const auth = await requireAuth()
  if (!auth.authorized) return auth.error!

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: 'Session ID required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  // Scope session to authenticated user
  const userSessionId = `${auth.userId}-${sessionId}`
  
  // Check if session exists without creating a new one
  const exists = hasExistingSession(userSessionId)
  
  return new Response(
    JSON.stringify({ 
      active: exists,
      sessionId: exists ? userSessionId : null,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
