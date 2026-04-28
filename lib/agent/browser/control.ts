/**
 * Browser Control Module
 * 
 * Unified API for browser automation:
 * - Playwright for scripted tasks
 * - Browser Harness for self-healing
 * - Chrome DevTools for inspection
 * - Selenium fallback for compatibility
 * 
 * Usage:
 *   const control = new BrowserControl()
 *   await control.navigate('https://example.com')
 *   await control.click('button[aria-label="Sign in"]')
 *   const text = await control.getText('h1')
 */

import { BrowserController, getBrowserController } from './controller'
import { BrowserHarness } from './harness'

export interface BrowserTask {
  name: string
  description: string
  steps: TaskStep[]
  timeout?: number
}

export interface TaskStep {
  action: 'navigate' | 'click' | 'fill' | 'wait' | 'screenshot' | 'getText' | 'execute'
  selector?: string
  value?: string
  text?: string
  timeout?: number
  waitFor?: {
    element?: string
    navigation?: boolean
    networkIdle?: boolean
  }
}

export interface TaskResult {
  success: boolean
  steps: StepResult[]
  totalTime: number
  screenshots: string[]
  error?: string
}

export interface StepResult {
  step: number
  action: string
  success: boolean
  result?: unknown
  error?: string
  duration: number
}

/**
 * High-level browser control API
 */
export class BrowserControl {
  private controller: BrowserController | null = null
  private harness: BrowserHarness | null = null
  private sessionId: string
  
  constructor(sessionId?: string) {
    this.sessionId = sessionId || Math.random().toString(36).substring(7)
  }
  
  /**
   * Initialize browser session
   */
  async initialize(): Promise<string> {
    this.controller = await getBrowserController(this.sessionId)
    this.harness = new BrowserHarness(this.controller, {
      maxRetries: 3,
      baseDelay: 500,
      maxDelay: 5000,
      visualDebug: false,
    })
    return this.sessionId
  }
  
  /**
   * Navigate to URL
   */
  async navigate(url: string): Promise<void> {
    if (!this.controller) throw new Error('Browser not initialized')
    const result = await this.controller.navigate(url)
    if (!result.success) throw new Error(result.error || 'Navigation failed')
  }
  
  /**
   * Click element by selector or accessibility query
   */
  async click(query: string | { text?: string; role?: string; selector?: string }): Promise<void> {
    if (!this.harness) throw new Error('Browser not initialized')
    
    const selector = typeof query === 'string' ? query : query.selector || ''
    await this.harness.click(selector)
  }
  
  /**
   * Fill input field
   */
  async fill(selector: string, value: string): Promise<void> {
    if (!this.harness) throw new Error('Browser not initialized')
    await this.harness.fill(selector, value)
  }
  
  /**
   * Get element text
   */
  async getText(selector?: string): Promise<string> {
    if (!this.harness) throw new Error('Browser not initialized')
    return this.harness.getText(selector)
  }
  
  /**
   * Take screenshot
   */
  async screenshot(): Promise<string> {
    if (!this.harness) throw new Error('Browser not initialized')
    return this.harness.screenshot()
  }
  
  /**
   * Wait for element
   */
  async waitFor(selector: string, timeout?: number): Promise<void> {
    if (!this.harness) throw new Error('Browser not initialized')
    await this.harness.waitForElement(selector, timeout)
  }
  
  /**
   * Execute JavaScript
   */
  async eval(script: string): Promise<unknown> {
    if (!this.controller) throw new Error('Browser not initialized')
    const result = await this.controller.executeScript(script)
    if (!result.success) throw new Error('Script execution failed')
    return result.result
  }
  
  /**
   * Run multi-step task
   */
  async runTask(task: BrowserTask): Promise<TaskResult> {
    if (!this.harness) throw new Error('Browser not initialized')
    
    const startTime = Date.now()
    const steps: StepResult[] = []
    const screenshots: string[] = []
    
    try {
      for (let i = 0; i < task.steps.length; i++) {
        const step = task.steps[i]
        const stepStart = Date.now()
        
        try {
          let result: unknown
          
          switch (step.action) {
            case 'navigate':
              await this.navigate(step.value || '')
              break
            
            case 'click':
              if (!step.selector) throw new Error('No selector provided')
              await this.click(step.selector)
              break
            
            case 'fill':
              if (!step.selector || !step.value) throw new Error('Missing selector or value')
              await this.fill(step.selector, step.value)
              break
            
            case 'wait':
              if (!step.selector) throw new Error('No selector provided')
              await this.waitFor(step.selector, step.timeout)
              break
            
            case 'screenshot':
              result = await this.screenshot()
              screenshots.push(result as string)
              break
            
            case 'getText':
              result = await this.getText(step.selector)
              break
            
            case 'execute':
              if (!step.text) throw new Error('No script provided')
              result = await this.eval(step.text)
              break
            
            default:
              throw new Error(`Unknown action: ${step.action}`)
          }
          
          steps.push({
            step: i + 1,
            action: step.action,
            success: true,
            result,
            duration: Date.now() - stepStart,
          })
        } catch (error) {
          steps.push({
            step: i + 1,
            action: step.action,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            duration: Date.now() - stepStart,
          })
          
          if (task.timeout && Date.now() - startTime > task.timeout) {
            throw new Error(`Task timeout after ${Date.now() - startTime}ms`)
          }
        }
      }
      
      return {
        success: steps.every(s => s.success),
        steps,
        screenshots,
        totalTime: Date.now() - startTime,
      }
    } catch (error) {
      return {
        success: false,
        steps,
        screenshots,
        totalTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Task failed',
      }
    }
  }
  
  /**
   * Get accessibility snapshot
   */
  async getAccessibilitySnapshot(): Promise<Record<string, unknown>> {
    if (!this.harness) throw new Error('Browser not initialized')
    return this.harness.getAccessibilitySnapshot()
  }
  
  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId
  }
  
  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.harness) {
      await this.harness.close()
    }
  }
}

/**
 * Factory for creating browser controls
 */
export async function createBrowserControl(sessionId?: string): Promise<BrowserControl> {
  const control = new BrowserControl(sessionId)
  await control.initialize()
  return control
}
