/**
 * Browser Automation Skills
 * 
 * Skills for agent-controlled web automation:
 * - navigate URLs
 * - interact with forms
 * - extract content
 * - run complex browser workflows
 */

import { createBrowserControl, type BrowserTask, type TaskResult } from '@/lib/agent/browser/control'
import type { AgentSkill, SkillExecutionContext } from '@/lib/agent/types'

// Track active browser sessions per context
const activeSessions = new Map<string, string>() // contextId -> sessionId

const navigateSkill: AgentSkill = {
  id: 'browser-navigate',
  name: 'Navigate URL',
  description: 'Navigate to a URL in the browser',
  category: 'browser',
  schema: {
    url: {
      type: 'string',
      description: 'URL to navigate to',
      examples: ['https://example.com', 'https://example.com/page'],
    },
  },
  execute: async (args, context) => {
    const { url } = args as { url: string }
    const contextId = context?.sessionId || 'default'
    
    let sessionId = activeSessions.get(contextId)
    const browser = await createBrowserControl(sessionId)
    if (!sessionId) {
      sessionId = browser.getSessionId()
      activeSessions.set(contextId, sessionId)
    }
    
    try {
      await browser.navigate(url)
      return {
        success: true,
        message: `Navigated to ${url}`,
        sessionId,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Navigation failed',
      }
    }
  },
}

const clickSkill: AgentSkill = {
  id: 'browser-click',
  name: 'Click Element',
  description: 'Click an element on the page',
  category: 'browser',
  schema: {
    selector: {
      type: 'string',
      description: 'CSS selector or element identifier',
      examples: ['button.submit', 'a[href="/login"]'],
    },
  },
  execute: async (args, context) => {
    const { selector } = args as { selector: string }
    const contextId = context?.sessionId || 'default'
    const sessionId = activeSessions.get(contextId)
    
    if (!sessionId) {
      return {
        success: false,
        error: 'No active browser session. Navigate first.',
      }
    }
    
    const browser = await createBrowserControl(sessionId)
    
    try {
      await browser.click(selector)
      return {
        success: true,
        message: `Clicked element: ${selector}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Click failed',
      }
    }
  },
}

const fillSkill: AgentSkill = {
  id: 'browser-fill',
  name: 'Fill Input Field',
  description: 'Fill an input field with text',
  category: 'browser',
  schema: {
    selector: {
      type: 'string',
      description: 'CSS selector for input element',
    },
    value: {
      type: 'string',
      description: 'Text to fill',
    },
  },
  execute: async (args, context) => {
    const { selector, value } = args as { selector: string; value: string }
    const contextId = context?.sessionId || 'default'
    const sessionId = activeSessions.get(contextId)
    
    if (!sessionId) {
      return {
        success: false,
        error: 'No active browser session. Navigate first.',
      }
    }
    
    const browser = await createBrowserControl(sessionId)
    
    try {
      await browser.fill(selector, value)
      return {
        success: true,
        message: `Filled ${selector} with "${value.substring(0, 50)}"`,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Fill failed',
      }
    }
  },
}

const getTextSkill: AgentSkill = {
  id: 'browser-get-text',
  name: 'Extract Text',
  description: 'Extract text content from an element',
  category: 'browser',
  schema: {
    selector: {
      type: 'string',
      description: 'CSS selector (optional, defaults to body)',
    },
  },
  execute: async (args, context) => {
    const { selector } = args as { selector?: string }
    const contextId = context?.sessionId || 'default'
    const sessionId = activeSessions.get(contextId)
    
    if (!sessionId) {
      return {
        success: false,
        error: 'No active browser session. Navigate first.',
      }
    }
    
    const browser = await createBrowserControl(sessionId)
    
    try {
      const text = await browser.getText(selector)
      return {
        success: true,
        text: text.substring(0, 5000), // Limit size
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract text',
      }
    }
  },
}

const screenshotSkill: AgentSkill = {
  id: 'browser-screenshot',
  name: 'Take Screenshot',
  description: 'Capture a screenshot of the current page',
  category: 'browser',
  schema: {},
  execute: async (_, context) => {
    const contextId = context?.sessionId || 'default'
    const sessionId = activeSessions.get(contextId)
    
    if (!sessionId) {
      return {
        success: false,
        error: 'No active browser session. Navigate first.',
      }
    }
    
    const browser = await createBrowserControl(sessionId)
    
    try {
      const screenshot = await browser.screenshot()
      return {
        success: true,
        screenshot: screenshot,
        format: 'base64',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Screenshot failed',
      }
    }
  },
}

const runTaskSkill: AgentSkill = {
  id: 'browser-run-task',
  name: 'Run Browser Task',
  description: 'Execute a multi-step browser automation task',
  category: 'browser',
  schema: {
    task: {
      type: 'object',
      description: 'Task definition with name, description, and steps array',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        steps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['navigate', 'click', 'fill', 'wait', 'screenshot', 'getText', 'execute'],
              },
              selector: { type: 'string' },
              value: { type: 'string' },
              text: { type: 'string' },
              timeout: { type: 'number' },
            },
          },
        },
        timeout: { type: 'number', description: 'Task timeout in ms' },
      },
    },
  },
  execute: async (args, context) => {
    const { task } = args as { task: BrowserTask }
    const contextId = context?.sessionId || 'default'
    let sessionId = activeSessions.get(contextId)
    
    const browser = await createBrowserControl(sessionId)
    if (!sessionId) {
      sessionId = browser.getSessionId()
      activeSessions.set(contextId, sessionId)
    }
    
    try {
      const result = await browser.runTask(task)
      
      return {
        success: result.success,
        task: task.name,
        steps: result.steps.map(s => ({
          step: s.step,
          action: s.action,
          success: s.success,
          duration: s.duration,
          error: s.error,
        })),
        totalTime: result.totalTime,
        screenshotCount: result.screenshots.length,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Task execution failed',
      }
    }
  },
}

const getAccessibilitySkill: AgentSkill = {
  id: 'browser-accessibility',
  name: 'Get Accessibility Info',
  description: 'Get semantic accessibility information about the page',
  category: 'browser',
  schema: {},
  execute: async (_, context) => {
    const contextId = context?.sessionId || 'default'
    const sessionId = activeSessions.get(contextId)
    
    if (!sessionId) {
      return {
        success: false,
        error: 'No active browser session. Navigate first.',
      }
    }
    
    const browser = await createBrowserControl(sessionId)
    
    try {
      const snapshot = await browser.getAccessibilitySnapshot()
      return {
        success: true,
        elements: snapshot,
        count: (snapshot as any[]).length,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get accessibility info',
      }
    }
  },
}

const closeSessionSkill: AgentSkill = {
  id: 'browser-close',
  name: 'Close Browser Session',
  description: 'Close the current browser session',
  category: 'browser',
  schema: {},
  execute: async (_, context) => {
    const contextId = context?.sessionId || 'default'
    const sessionId = activeSessions.get(contextId)
    
    if (!sessionId) {
      return {
        success: false,
        error: 'No active browser session',
      }
    }
    
    try {
      const browser = await createBrowserControl(sessionId)
      await browser.close()
      activeSessions.delete(contextId)
      
      return {
        success: true,
        message: 'Browser session closed',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to close session',
      }
    }
  },
}

export const browserAutomationSkills = [
  navigateSkill,
  clickSkill,
  fillSkill,
  getTextSkill,
  screenshotSkill,
  runTaskSkill,
  getAccessibilitySkill,
  closeSessionSkill,
]
