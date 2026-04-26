import { streamText, type CoreMessage } from 'ai'
import { getDefaultModel } from '@/lib/agent/providers/openrouter'
import { AGENT_CONFIG } from '@/lib/agent/config'
import { skillRegistry } from '@/lib/agent/skills/skill-registry'
import { AgentMemory } from '@/lib/agent/storage/memory'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json()
    
    // Initialize or retrieve memory
    const memory = new AgentMemory(sessionId, { source: 'web' })
    
    // Build conversation history
    const conversationMessages: CoreMessage[] = [
      {
        role: 'system',
        content: AGENT_CONFIG.systemPrompt,
      },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]
    
    // Get tool definitions
    const tools = skillRegistry.getToolDefinitions()
    
    // Get model
    const model = getDefaultModel()
    
    // Stream the response
    const result = streamText({
      model,
      messages: conversationMessages,
      tools,
      maxSteps: 5,
      onFinish: async ({ text }) => {
        // Store the response in memory
        if (messages.length > 0) {
          const lastUserMessage = messages[messages.length - 1]
          if (lastUserMessage.role === 'user') {
            memory.addMessage('user', lastUserMessage.content)
          }
        }
        memory.addMessage('assistant', text)
      },
    })
    
    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Agent chat error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Chat failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Get chat history
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: 'Session ID required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  const memory = new AgentMemory(sessionId)
  const messages = memory.getMessages()
  
  return new Response(
    JSON.stringify({ messages, sessionId }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
