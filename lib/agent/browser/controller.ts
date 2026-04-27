import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { v4 as uuid } from 'uuid'

interface BrowserSession {
  id: string
  browser: Browser
  context: BrowserContext
  page: Page
  createdAt: Date
  lastActivity: Date
}

// Session store
const sessions = new Map<string, BrowserSession>()

// Blocked URL patterns for SSRF protection
const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254', // AWS metadata
  'metadata.google.internal', // GCP metadata
  '100.100.100.200', // Alibaba metadata
]

const BLOCKED_IP_RANGES = [
  /^10\./,        // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
  /^192\.168\./, // 192.168.0.0/16
  /^127\./,      // 127.0.0.0/8
  /^0\./,        // 0.0.0.0/8
  /^169\.254\./, // Link-local
]

function isUrlAllowed(urlString: string): { allowed: boolean; reason?: string } {
  try {
    const url = new URL(urlString)
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { allowed: false, reason: `Protocol ${url.protocol} not allowed` }
    }
    
    // Check blocked hosts
    const hostname = url.hostname.toLowerCase()
    if (BLOCKED_HOSTS.includes(hostname)) {
      return { allowed: false, reason: 'Access to internal hosts blocked' }
    }
    
    // Check blocked IP ranges
    for (const pattern of BLOCKED_IP_RANGES) {
      if (pattern.test(hostname)) {
        return { allowed: false, reason: 'Access to private IP ranges blocked' }
      }
    }
    
    return { allowed: true }
  } catch {
    return { allowed: false, reason: 'Invalid URL' }
  }
}

// Session timeout (5 minutes of inactivity)
const SESSION_TIMEOUT = 5 * 60 * 1000

export class BrowserController {
  private sessionId: string
  private session: BrowserSession | null = null
  
  constructor(sessionId?: string) {
    this.sessionId = sessionId || uuid()
  }
  
  async initialize(): Promise<string> {
    // Check for existing session
    const existing = sessions.get(this.sessionId)
    if (existing) {
      existing.lastActivity = new Date()
      this.session = existing
      return this.sessionId
    }
    
    // Create new browser session
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    })
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    
    const page = await context.newPage()
    
    const session: BrowserSession = {
      id: this.sessionId,
      browser,
      context,
      page,
      createdAt: new Date(),
      lastActivity: new Date(),
    }
    
    sessions.set(this.sessionId, session)
    this.session = session
    
    // Set up auto-cleanup
    this.setupAutoCleanup()
    
    return this.sessionId
  }
  
  private setupAutoCleanup(): void {
    const checkInterval = setInterval(() => {
      const session = sessions.get(this.sessionId)
      if (session) {
        const inactive = Date.now() - session.lastActivity.getTime()
        if (inactive > SESSION_TIMEOUT) {
          this.close()
          clearInterval(checkInterval)
        }
      } else {
        clearInterval(checkInterval)
      }
    }, 60000) // Check every minute
  }
  
  private updateActivity(): void {
    if (this.session) {
      this.session.lastActivity = new Date()
    }
  }
  
  async navigate(url: string): Promise<{ success: boolean; title: string; url: string; error?: string }> {
    if (!this.session) {
      throw new Error('Browser session not initialized')
    }
    
    // SSRF protection: validate URL before navigation
    const urlCheck = isUrlAllowed(url)
    if (!urlCheck.allowed) {
      return { 
        success: false, 
        title: '', 
        url: url,
        error: urlCheck.reason,
      }
    }
    
    this.updateActivity()
    
    try {
      await this.session.page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      })
      
      const title = await this.session.page.title()
      const finalUrl = this.session.page.url()
      
      return { success: true, title, url: finalUrl }
    } catch (error) {
      return { 
        success: false, 
        title: '', 
        url: url,
        error: error instanceof Error ? error.message : 'Navigation failed',
      }
    }
  }
  
  async click(selector: string): Promise<{ success: boolean; message: string }> {
    if (!this.session) {
      throw new Error('Browser session not initialized')
    }
    
    this.updateActivity()
    
    try {
      await this.session.page.click(selector, { timeout: 5000 })
      return { success: true, message: `Clicked element: ${selector}` }
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to click: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }
    }
  }
  
  async type(selector: string, text: string): Promise<{ success: boolean; message: string }> {
    if (!this.session) {
      throw new Error('Browser session not initialized')
    }
    
    this.updateActivity()
    
    try {
      await this.session.page.fill(selector, text, { timeout: 5000 })
      return { success: true, message: `Typed "${text}" into ${selector}` }
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to type: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }
    }
  }
  
  async screenshot(): Promise<{ success: boolean; data: string }> {
    if (!this.session) {
      throw new Error('Browser session not initialized')
    }
    
    this.updateActivity()
    
    try {
      const buffer = await this.session.page.screenshot({ 
        type: 'png',
        fullPage: false,
      })
      
      const base64 = buffer.toString('base64')
      return { success: true, data: `data:image/png;base64,${base64}` }
    } catch (error) {
      return { success: false, data: '' }
    }
  }
  
  async getContent(): Promise<{ success: boolean; html: string; text: string }> {
    if (!this.session) {
      throw new Error('Browser session not initialized')
    }
    
    this.updateActivity()
    
    try {
      const html = await this.session.page.content()
      const text = await this.session.page.innerText('body')
      
      return { 
        success: true, 
        html: html.substring(0, 10000), // Limit size
        text: text.substring(0, 5000),
      }
    } catch (error) {
      return { success: false, html: '', text: '' }
    }
  }
  
  async executeScript(script: string): Promise<{ success: boolean; result: unknown }> {
    if (!this.session) {
      throw new Error('Browser session not initialized')
    }
    
    this.updateActivity()
    
    try {
      const result = await this.session.page.evaluate(script)
      return { success: true, result }
    } catch (error) {
      return { 
        success: false, 
        result: error instanceof Error ? error.message : 'Script execution failed' 
      }
    }
  }
  
  async goBack(): Promise<{ success: boolean }> {
    if (!this.session) {
      throw new Error('Browser session not initialized')
    }
    
    this.updateActivity()
    
    try {
      await this.session.page.goBack({ timeout: 10000 })
      return { success: true }
    } catch {
      return { success: false }
    }
  }
  
  async goForward(): Promise<{ success: boolean }> {
    if (!this.session) {
      throw new Error('Browser session not initialized')
    }
    
    this.updateActivity()
    
    try {
      await this.session.page.goForward({ timeout: 10000 })
      return { success: true }
    } catch {
      return { success: false }
    }
  }
  
  async reload(): Promise<{ success: boolean }> {
    if (!this.session) {
      throw new Error('Browser session not initialized')
    }
    
    this.updateActivity()
    
    try {
      await this.session.page.reload({ timeout: 30000 })
      return { success: true }
    } catch {
      return { success: false }
    }
  }
  
  async close(): Promise<void> {
    const session = sessions.get(this.sessionId)
    if (session) {
      await session.context.close()
      await session.browser.close()
      sessions.delete(this.sessionId)
    }
    this.session = null
  }
  
  getSessionId(): string {
    return this.sessionId
  }
  
  isActive(): boolean {
    return sessions.has(this.sessionId)
  }
}

// Check if session exists without creating new one
export function hasExistingSession(sessionId: string): boolean {
  return sessions.has(sessionId)
}

// Get existing session or create new one
export async function getBrowserController(sessionId?: string): Promise<BrowserController> {
  const controller = new BrowserController(sessionId)
  await controller.initialize()
  return controller
}

// Close all sessions (for cleanup)
export async function closeAllSessions(): Promise<void> {
  for (const [, session] of sessions) {
    await session.context.close()
    await session.browser.close()
  }
  sessions.clear()
}
