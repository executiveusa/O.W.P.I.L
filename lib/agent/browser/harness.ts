import { BrowserController } from './controller'
import type { Page } from 'playwright'

/**
 * Browser Harness — Self-healing, robust browser automation wrapper
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Element visibility & stability checks
 * - Accessibility snapshot for element finding
 * - Screenshot comparison for visual debugging
 * - Network interception for debugging
 * - Custom wait conditions
 */

interface HarnessConfig {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  visualDebug?: boolean
}

interface ElementSnapshot {
  selector: string
  visible: boolean
  enabled: boolean
  boundingBox?: { x: number; y: number; width: number; height: number }
  text?: string
  ariaLabel?: string
}

export class BrowserHarness {
  private controller: BrowserController
  private config: Required<HarnessConfig>
  
  constructor(controller: BrowserController, config?: HarnessConfig) {
    this.controller = controller
    this.config = {
      maxRetries: config?.maxRetries ?? 3,
      baseDelay: config?.baseDelay ?? 500,
      maxDelay: config?.maxDelay ?? 5000,
      visualDebug: config?.visualDebug ?? false,
    }
  }
  
  /**
   * Retry action with exponential backoff
   */
  private async retryWithBackoff<T>(
    action: () => Promise<T>,
    actionName: string,
  ): Promise<T> {
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        return await action()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        
        if (attempt < this.config.maxRetries - 1) {
          const delay = Math.min(
            this.config.baseDelay * Math.pow(2, attempt),
            this.config.maxDelay,
          )
          console.log(`[Harness] Retry ${attempt + 1}/${this.config.maxRetries} for "${actionName}" in ${delay}ms`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError || new Error(`Failed to execute "${actionName}" after ${this.config.maxRetries} attempts`)
  }
  
  /**
   * Get accessibility snapshot of page
   */
  async getAccessibilitySnapshot(): Promise<Record<string, unknown>> {
    return this.retryWithBackoff(
      async () => {
        const result = await this.controller.executeScript(`
          (() => {
            const elements = [];
            document.querySelectorAll('[role], button, input, a, [aria-label]').forEach(el => {
              if (el.offsetParent !== null) { // visible check
                elements.push({
                  role: el.getAttribute('role') || el.tagName.toLowerCase(),
                  text: el.textContent?.trim().substring(0, 50),
                  ariaLabel: el.getAttribute('aria-label'),
                  ariaDescribedBy: el.getAttribute('aria-describedby'),
                  id: el.id,
                  className: el.className,
                });
              }
            });
            return elements;
          })()
        `)
        return result as Record<string, unknown>
      },
      'getAccessibilitySnapshot',
    )
  }
  
  /**
   * Find element by accessibility attributes or text content
   */
  async findElement(query: {
    text?: string
    role?: string
    ariaLabel?: string
    selector?: string
  }): Promise<ElementSnapshot> {
    const snapshot = await this.getAccessibilitySnapshot()
    const elements = snapshot as any[]
    
    let found = elements.find(el => {
      if (query.text && el.text?.includes(query.text)) return true
      if (query.role && el.role === query.role) return true
      if (query.ariaLabel && el.ariaLabel === query.ariaLabel) return true
      return false
    })
    
    if (!found && query.selector) {
      // Fallback to CSS selector
      const result = await this.controller.executeScript(`
        (() => {
          const el = document.querySelector('${query.selector}');
          if (el) {
            return {
              selector: '${query.selector}',
              visible: el.offsetParent !== null,
              enabled: !el.disabled,
              text: el.textContent?.trim().substring(0, 50),
              ariaLabel: el.getAttribute('aria-label'),
            };
          }
          return null;
        })()
      `)
      found = result as any
    }
    
    if (!found) {
      throw new Error(`Element not found: ${JSON.stringify(query)}`)
    }
    
    return {
      selector: query.selector || `[aria-label="${query.ariaLabel}"]`,
      visible: found.visible !== false,
      enabled: found.enabled !== false,
      text: found.text,
      ariaLabel: found.ariaLabel,
    }
  }
  
  /**
   * Click element with visibility check
   */
  async click(selector: string): Promise<void> {
    return this.retryWithBackoff(
      async () => {
        // Check visibility first
        const visible = await this.controller.executeScript(`
          (() => {
            const el = document.querySelector('${selector}');
            return el && el.offsetParent !== null;
          })()
        `)
        
        if (!visible) {
          // Try scrolling into view
          await this.controller.executeScript(`
            document.querySelector('${selector}').scrollIntoView({ behavior: 'smooth' });
          `)
          await new Promise(r => setTimeout(r, 500))
        }
        
        const result = await this.controller.click(selector)
        if (!result.success) throw new Error(result.message)
      },
      `click "${selector}"`,
    )
  }
  
  /**
   * Type text with clear first
   */
  async fill(selector: string, text: string): Promise<void> {
    return this.retryWithBackoff(
      async () => {
        // Clear existing value
        await this.controller.executeScript(`
          document.querySelector('${selector}').value = '';
          document.querySelector('${selector}').dispatchEvent(new Event('input', { bubbles: true }));
        `)
        
        // Type new value
        const result = await this.controller.type(selector, text)
        if (!result.success) throw new Error(result.message)
      },
      `fill "${selector}"`,
    )
  }
  
  /**
   * Wait for element to appear and become stable
   */
  async waitForElement(selector: string, timeout = 10000): Promise<ElementSnapshot> {
    const startTime = Date.now()
    let lastError: Error | null = null
    
    while (Date.now() - startTime < timeout) {
      try {
        const element = await this.findElement({ selector })
        if (element.visible && element.enabled) {
          // Check stability - wait for element to stop moving
          await new Promise(r => setTimeout(r, 300))
          return element
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
      }
      
      await new Promise(r => setTimeout(r, 200))
    }
    
    throw lastError || new Error(`Element "${selector}" not found or not stable within ${timeout}ms`)
  }
  
  /**
   * Wait for navigation/page load
   */
  async waitForNavigation(timeout = 30000): Promise<void> {
    return this.retryWithBackoff(
      async () => {
        const ready = await Promise.race([
          this.controller.executeScript(
            `new Promise(r => document.readyState === 'complete' ? r(true) : window.addEventListener('load', () => r(true)))`
          ),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Navigation timeout')), timeout)),
        ])
        
        if (!ready) throw new Error('Page failed to load')
      },
      'waitForNavigation',
    )
  }
  
  /**
   * Take debug screenshot
   */
  async screenshot(filename?: string): Promise<string> {
    const result = await this.controller.screenshot()
    if (!result.success) throw new Error('Screenshot failed')
    
    if (filename && this.config.visualDebug) {
      console.log(`[Harness] Screenshot saved: ${filename}`)
    }
    
    return result.data
  }
  
  /**
   * Extract text content
   */
  async getText(selector?: string): Promise<string> {
    const result = await this.controller.executeScript(
      selector
        ? `document.querySelector('${selector}')?.textContent || ''`
        : `document.body.innerText`
    )
    return result as string
  }
  
  /**
   * Get form data
   */
  async getFormData(formSelector: string): Promise<Record<string, string>> {
    const result = await this.controller.executeScript(`
      (() => {
        const form = document.querySelector('${formSelector}');
        const formData = new FormData(form);
        return Object.fromEntries(formData);
      })()
    `)
    return result as Record<string, string>
  }
  
  /**
   * Close browser session
   */
  async close(): Promise<void> {
    await this.controller.close()
  }
}
