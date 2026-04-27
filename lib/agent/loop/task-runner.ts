import { generateText, streamText, type CoreMessage } from 'ai'
import { getDefaultModel } from '../providers/openrouter'
import { AGENT_CONFIG } from '../config'
import type { AgentTask, IterationState, StepResult, ToolCall } from '../types'
import { skillRegistry, executeSkill } from '../skills/skill-registry'
import { v4 as uuid } from 'uuid'

// Ralphy-style autonomous task runner
export class TaskRunner {
  private task: AgentTask
  private state: IterationState
  private messages: CoreMessage[]
  private onProgress?: (state: IterationState) => void
  
  constructor(
    taskDescription: string,
    options?: {
      maxIterations?: number
      onProgress?: (state: IterationState) => void
    }
  ) {
    const now = new Date()
    const maxIterations = options?.maxIterations ?? AGENT_CONFIG.loop.maxIterations
    
    this.task = {
      id: uuid(),
      description: taskDescription,
      status: 'pending',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
      iterations: 0,
      maxIterations,
      subtasks: [],
    }
    
    this.state = {
      iteration: 0,
      maxIterations,
      taskDescription,
      currentStep: 'Planning approach',
      previousSteps: [],
      isComplete: false,
      needsUserInput: false,
    }
    
    this.messages = [
      {
        role: 'system',
        content: this.buildSystemPrompt(),
      },
      {
        role: 'user',
        content: `Task: ${taskDescription}\n\nBegin by analyzing the task and outlining your approach. Then execute step by step, using available tools as needed. After each step, assess if the task is complete or if you need to continue.`,
      },
    ]
    
    this.onProgress = options?.onProgress
  }
  
  private buildSystemPrompt(): string {
    const tools = skillRegistry.getAll()
    const toolDescriptions = tools
      .map(t => `- ${t.name}: ${t.description}`)
      .join('\n')
    
    return `${AGENT_CONFIG.systemPrompt}

Available tools:
${toolDescriptions}

Execution Protocol:
1. THINK: Analyze the current state and decide the next action
2. ACT: Execute the action using appropriate tools
3. OBSERVE: Review the results
4. DECIDE: Either continue to the next step or mark task as complete

Always respond with your thinking process, then any tool calls needed.
When the task is fully complete, respond with: [TASK_COMPLETE]
If you need user input, respond with: [NEEDS_INPUT]: <your question>
If the task cannot be completed, respond with: [TASK_FAILED]: <reason>`
  }
  
  async run(): Promise<AgentTask> {
    this.task.status = 'running'
    this.task.updatedAt = new Date()
    
    while (
      this.state.iteration < this.state.maxIterations &&
      !this.state.isComplete &&
      !this.state.needsUserInput
    ) {
      await this.executeIteration()
      
      if (this.onProgress) {
        this.onProgress(this.state)
      }
      
      // Small delay between iterations
      await new Promise(r => setTimeout(r, AGENT_CONFIG.loop.iterationDelayMs))
    }
    
    // Finalize task status
    if (this.state.isComplete) {
      this.task.status = 'completed'
      this.task.completedAt = new Date()
    } else if (this.state.iteration >= this.state.maxIterations) {
      this.task.status = 'failed'
      this.task.error = 'Max iterations reached'
    }
    
    this.task.updatedAt = new Date()
    return this.task
  }
  
  private async executeIteration(): Promise<void> {
    this.state.iteration++
    this.task.iterations = this.state.iteration
    
    const model = getDefaultModel()
    const tools = skillRegistry.getToolDefinitions()
    
    try {
      const response = await generateText({
        model,
        messages: this.messages,
        tools,
        maxSteps: 5, // Allow multiple tool calls per iteration
      })
      
      // Process the response
      const assistantContent = response.text
      const toolResults: ToolCall[] = []
      
      // Handle tool calls
      if (response.toolCalls && response.toolCalls.length > 0) {
        for (const toolCall of response.toolCalls) {
          const result = await executeSkill(toolCall.toolName, toolCall.args)
          toolResults.push({
            id: uuid(),
            name: toolCall.toolName,
            arguments: toolCall.args as Record<string, unknown>,
            result,
            executedAt: new Date(),
          })
        }
      }
      
      // Add assistant message to history
      this.messages.push({
        role: 'assistant',
        content: assistantContent,
      })
      
      // Check for completion signals
      if (assistantContent.includes('[TASK_COMPLETE]')) {
        this.state.isComplete = true
        this.task.result = {
          success: true,
          output: assistantContent.replace('[TASK_COMPLETE]', '').trim(),
          artifacts: [],
        }
      } else if (assistantContent.includes('[NEEDS_INPUT]')) {
        this.state.needsUserInput = true
        this.state.currentStep = assistantContent.split('[NEEDS_INPUT]:')[1]?.trim() || 'Awaiting input'
      } else if (assistantContent.includes('[TASK_FAILED]')) {
        this.state.isComplete = true
        this.task.status = 'failed'
        this.task.error = assistantContent.split('[TASK_FAILED]:')[1]?.trim() || 'Unknown error'
      }
      
      // Record step result
      const stepResult: StepResult = {
        step: `Iteration ${this.state.iteration}`,
        action: toolResults.length > 0 
          ? `Executed: ${toolResults.map(t => t.name).join(', ')}`
          : 'Analysis/Planning',
        result: assistantContent.substring(0, 200),
        success: true,
      }
      this.state.previousSteps.push(stepResult)
      this.state.currentStep = this.extractCurrentStep(assistantContent)
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      this.state.previousSteps.push({
        step: `Iteration ${this.state.iteration}`,
        action: 'Error',
        result: errorMsg,
        success: false,
      })
      
      // Retry logic
      if (this.state.iteration < AGENT_CONFIG.loop.retryAttempts) {
        this.messages.push({
          role: 'user',
          content: `An error occurred: ${errorMsg}. Please try a different approach.`,
        })
      } else {
        this.task.status = 'failed'
        this.task.error = errorMsg
        this.state.isComplete = true
      }
    }
  }
  
  private extractCurrentStep(content: string): string {
    // Extract the current action from the response
    const lines = content.split('\n').filter(l => l.trim())
    return lines[0]?.substring(0, 100) || 'Processing...'
  }
  
  // Allow providing user input to continue
  continueWithInput(input: string): void {
    this.messages.push({
      role: 'user',
      content: input,
    })
    this.state.needsUserInput = false
  }
  
  // Get current state
  getState(): IterationState {
    return { ...this.state }
  }
  
  // Get the task
  getTask(): AgentTask {
    return { ...this.task }
  }
  
  // Cancel the task
  cancel(): void {
    this.task.status = 'cancelled'
    this.task.updatedAt = new Date()
    this.state.isComplete = true
  }
}

// Convenience function for single task execution
export async function runTask(
  description: string,
  options?: {
    maxIterations?: number
    onProgress?: (state: IterationState) => void
  }
): Promise<AgentTask> {
  const runner = new TaskRunner(description, options)
  return runner.run()
}
