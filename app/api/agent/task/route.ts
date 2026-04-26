import { TaskRunner } from '@/lib/agent/loop/task-runner'
import { AgentMemory } from '@/lib/agent/storage/memory'
import type { IterationState } from '@/lib/agent/types'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for long-running tasks

// Start a new autonomous task
export async function POST(req: Request) {
  try {
    const { description, sessionId, maxIterations } = await req.json()
    
    if (!description) {
      return new Response(
        JSON.stringify({ error: 'Task description required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const memory = new AgentMemory(sessionId, { source: 'web' })
    
    // Create and run the task
    const runner = new TaskRunner(description, {
      maxIterations: maxIterations || 10,
      onProgress: (state: IterationState) => {
        // Progress updates would be sent via SSE in production
        console.log(`Task progress: ${state.iteration}/${state.maxIterations} - ${state.currentStep}`)
      },
    })
    
    // Run the task
    const task = await runner.run()
    
    // Store in memory
    memory.addTask(task)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        task: {
          id: task.id,
          description: task.description,
          status: task.status,
          iterations: task.iterations,
          result: task.result,
          error: task.error,
        },
        sessionId: memory.getSessionId(),
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Task execution error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Task failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Get task status
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const taskId = searchParams.get('taskId')
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: 'Session ID required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  const memory = new AgentMemory(sessionId)
  
  if (taskId) {
    const task = memory.getTask(taskId)
    if (!task) {
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }
    return new Response(
      JSON.stringify({ task }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  // Return all tasks for session
  const tasks = memory.getTasks()
  return new Response(
    JSON.stringify({ tasks }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
