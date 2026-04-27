// Core Agent Types

export interface AgentTask {
  id: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  iterations: number
  maxIterations: number
  result?: TaskResult
  error?: string
  subtasks: AgentSubtask[]
}

export interface AgentSubtask {
  id: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  toolCalls: ToolCall[]
}

export interface TaskResult {
  success: boolean
  output: string
  artifacts: Artifact[]
}

export interface Artifact {
  type: 'file' | 'image' | 'code' | 'url' | 'message'
  name: string
  content: string
  metadata?: Record<string, unknown>
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
  result?: unknown
  error?: string
  executedAt: Date
}

export interface AgentMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  toolCalls?: ToolCall[]
  createdAt: Date
}

export interface AgentSession {
  id: string
  messages: AgentMessage[]
  tasks: AgentTask[]
  createdAt: Date
  updatedAt: Date
  metadata: SessionMetadata
}

export interface SessionMetadata {
  source: 'web' | 'discord' | 'voice' | 'api'
  userId?: string
  discordChannelId?: string
}

export interface AgentCapability {
  name: string
  description: string
  enabled: boolean
  permissions: string[]
}

// Context passed to skill execution for scoping
export interface SkillExecutionContext {
  sessionId?: string
  userId?: string
  taskId?: string
  source: 'web' | 'discord' | 'voice' | 'api'
}

export interface AgentSkill {
  id: string
  name: string
  description: string
  category: 'file' | 'web' | 'browser' | 'discord' | 'owpil' | 'system'
  execute: (args: Record<string, unknown>, context?: SkillExecutionContext) => Promise<unknown>
  schema: Record<string, unknown> // JSON Schema for arguments
}

// Iteration state for Ralphy-style loop
export interface IterationState {
  iteration: number
  maxIterations: number
  taskDescription: string
  currentStep: string
  previousSteps: StepResult[]
  isComplete: boolean
  needsUserInput: boolean
}

export interface StepResult {
  step: string
  action: string
  result: string
  success: boolean
}
