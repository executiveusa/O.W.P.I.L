import { v4 as uuid } from 'uuid'
import type { AgentMessage, AgentSession, AgentTask, SessionMetadata } from '../types'
import { AGENT_CONFIG } from '../config'

// In-memory store (will be replaced with encrypted persistence)
const sessions = new Map<string, AgentSession>()
const activeTasks = new Map<string, AgentTask>()

export class AgentMemory {
  private sessionId: string
  private session: AgentSession
  
  constructor(sessionId?: string, metadata?: Partial<SessionMetadata>) {
    this.sessionId = sessionId || uuid()
    
    const existing = sessions.get(this.sessionId)
    if (existing) {
      this.session = existing
    } else {
      this.session = {
        id: this.sessionId,
        messages: [],
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          source: metadata?.source || 'web',
          userId: metadata?.userId,
          discordChannelId: metadata?.discordChannelId,
        },
      }
      sessions.set(this.sessionId, this.session)
    }
  }
  
  // Message management
  addMessage(role: AgentMessage['role'], content: string): AgentMessage {
    const message: AgentMessage = {
      id: uuid(),
      role,
      content,
      createdAt: new Date(),
    }
    
    this.session.messages.push(message)
    
    // Trim old messages if exceeding limit
    const maxHistory = AGENT_CONFIG.memory.maxConversationHistory
    if (this.session.messages.length > maxHistory) {
      // Keep system messages, trim oldest user/assistant messages
      const systemMessages = this.session.messages.filter(m => m.role === 'system')
      const otherMessages = this.session.messages.filter(m => m.role !== 'system')
      this.session.messages = [
        ...systemMessages,
        ...otherMessages.slice(-maxHistory + systemMessages.length),
      ]
    }
    
    this.session.updatedAt = new Date()
    return message
  }
  
  getMessages(): AgentMessage[] {
    return [...this.session.messages]
  }
  
  getRecentMessages(count: number): AgentMessage[] {
    return this.session.messages.slice(-count)
  }
  
  // Task management
  addTask(task: AgentTask): void {
    this.session.tasks.push(task)
    activeTasks.set(task.id, task)
    this.session.updatedAt = new Date()
  }
  
  getTask(taskId: string): AgentTask | undefined {
    // Only return task if it belongs to this session (prevents cross-session leakage)
    const task = this.session.tasks.find(t => t.id === taskId)
    return task
  }
  
  updateTask(taskId: string, updates: Partial<AgentTask>): void {
    const task = activeTasks.get(taskId)
    if (task) {
      Object.assign(task, updates, { updatedAt: new Date() })
    }
  }
  
  getTasks(): AgentTask[] {
    return [...this.session.tasks]
  }
  
  getActiveTasks(): AgentTask[] {
    return this.session.tasks.filter(t => t.status === 'running' || t.status === 'pending')
  }
  
  // Session management
  getSession(): AgentSession {
    return { ...this.session }
  }
  
  getSessionId(): string {
    return this.sessionId
  }
  
  clearHistory(): void {
    const systemMessages = this.session.messages.filter(m => m.role === 'system')
    this.session.messages = systemMessages
    this.session.updatedAt = new Date()
  }
  
  // Export for persistence
  export(): string {
    return JSON.stringify(this.session)
  }
  
  // Import from persistence
  static import(data: string): AgentMemory {
    const session = JSON.parse(data) as AgentSession
    const memory = new AgentMemory(session.id, session.metadata)
    memory.session = session
    sessions.set(session.id, session)
    return memory
  }
}

// Get all active sessions
export function getAllSessions(): AgentSession[] {
  return Array.from(sessions.values())
}

// Get session by ID
export function getSession(sessionId: string): AgentSession | undefined {
  return sessions.get(sessionId)
}

// Delete session
export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId)
}
