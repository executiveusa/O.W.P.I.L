import type { AgentSkill, SkillExecutionContext } from '../../types'
import { z } from 'zod'
import { getBrowserController } from '../../browser/controller'

// Session IDs are scoped per execution context (passed via args.context)
// This prevents cross-contamination between users/requests

export const browserSkills: AgentSkill[] = [
  {
    id: 'browser_navigate',
    name: 'Navigate Browser',
    description: 'Navigate the browser to a specific URL',
    category: 'browser',
    schema: {
      url: z.string().describe('The URL to navigate to'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const url = args.url as string
      const sessionId = context?.sessionId
      const controller = await getBrowserController(sessionId)
      
      const result = await controller.navigate(url)
      return result
    },
  },
  
  {
    id: 'browser_click',
    name: 'Click Element',
    description: 'Click an element on the page by CSS selector',
    category: 'browser',
    schema: {
      selector: z.string().describe('CSS selector for the element to click'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const selector = args.selector as string
      const sessionId = context?.sessionId
      const controller = await getBrowserController(sessionId)
      
      const result = await controller.click(selector)
      return result
    },
  },
  
  {
    id: 'browser_type',
    name: 'Type Text',
    description: 'Type text into an input field',
    category: 'browser',
    schema: {
      selector: z.string().describe('CSS selector for the input element'),
      text: z.string().describe('Text to type'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const selector = args.selector as string
      const text = args.text as string
      const sessionId = context?.sessionId
      const controller = await getBrowserController(sessionId)
      
      const result = await controller.type(selector, text)
      return result
    },
  },
  
  {
    id: 'browser_screenshot',
    name: 'Take Screenshot',
    description: 'Capture a screenshot of the current page',
    category: 'browser',
    schema: {},
    execute: async (_args, context?: SkillExecutionContext) => {
      const sessionId = context?.sessionId
      const controller = await getBrowserController(sessionId)
      
      const result = await controller.screenshot()
      return result
    },
  },
  
  {
    id: 'browser_get_content',
    name: 'Get Page Content',
    description: 'Get the text content of the current page',
    category: 'browser',
    schema: {},
    execute: async (_args, context?: SkillExecutionContext) => {
      const sessionId = context?.sessionId
      const controller = await getBrowserController(sessionId)
      
      const result = await controller.getContent()
      return { 
        success: result.success, 
        text: result.text,
      }
    },
  },
  
  {
    id: 'browser_execute_js',
    name: 'Execute JavaScript',
    description: 'Execute JavaScript code in the browser context',
    category: 'browser',
    schema: {
      script: z.string().describe('JavaScript code to execute'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const script = args.script as string
      const sessionId = context?.sessionId
      const controller = await getBrowserController(sessionId)
      
      const result = await controller.executeScript(script)
      return result
    },
  },
]
