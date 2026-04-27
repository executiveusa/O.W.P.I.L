import { getBrowserController } from '@/lib/agent/browser/controller'

export const runtime = 'nodejs'
export const maxDuration = 60

// Browser control actions
export async function POST(req: Request) {
  try {
    const { action, sessionId, ...params } = await req.json()
    
    const controller = await getBrowserController(sessionId)
    
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

// Get session status
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: 'Session ID required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  try {
    const controller = await getBrowserController(sessionId)
    
    return new Response(
      JSON.stringify({ 
        active: controller.isActive(),
        sessionId: controller.getSessionId(),
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ active: false, error: 'Session not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
