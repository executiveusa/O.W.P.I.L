import { NextRequest, NextResponse } from 'next/server'
import { BrowserController, getBrowserController } from '@/lib/agent/browser/controller'

/**
 * Chrome DevTools MCP Server
 * 
 * Provides tools for:
 * - Live browser inspection
 * - Console access & logging
 * - Network monitoring
 * - Performance profiling
 * - DOM traversal & element selection
 */

interface DevToolsRequest {
  sessionId: string
  tool: string
  params: Record<string, unknown>
}

interface DevToolsResponse {
  success: boolean
  data?: unknown
  error?: string
}

// Live console logs per session
const consoleLogs = new Map<string, Array<{ level: string; message: string; timestamp: Date }>>()

async function inspectElement(
  controller: BrowserController,
  selector: string,
): Promise<DevToolsResponse> {
  try {
    const result = await controller.executeScript(`
      (() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        
        const style = window.getComputedStyle(el);
        return {
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          innerText: el.innerText?.substring(0, 200),
          innerHTML: el.innerHTML?.substring(0, 500),
          computedStyle: {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            position: style.position,
            zIndex: style.zIndex,
          },
          boundingBox: el.getBoundingClientRect(),
          ariaLabel: el.getAttribute('aria-label'),
          role: el.getAttribute('role'),
          dataAttrs: Object.fromEntries(
            Object.entries(el.dataset).map(([k, v]) => [k, v?.substring(0, 100)])
          ),
        };
      })()
    `)
    
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to inspect element',
    }
  }
}

async function getConsoleOutput(
  sessionId: string,
): Promise<DevToolsResponse> {
  const logs = consoleLogs.get(sessionId) || []
  
  return {
    success: true,
    data: {
      logs: logs.slice(-100), // Last 100 logs
      count: logs.length,
    },
  }
}

async function clearConsole(sessionId: string): Promise<DevToolsResponse> {
  consoleLogs.set(sessionId, [])
  return {
    success: true,
    data: { cleared: true },
  }
}

async function getNetworkInfo(
  controller: BrowserController,
): Promise<DevToolsResponse> {
  try {
    const result = await controller.executeScript(`
      (() => {
        const entries = performance.getEntriesByType('navigation');
        const paint = performance.getEntriesByType('paint');
        return {
          navigationTiming: entries[0],
          paintTiming: paint,
          resourceTiming: performance.getEntriesByType('resource').slice(0, 10),
        };
      })()
    `)
    
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get network info',
    }
  }
}

async function evaluateExpression(
  controller: BrowserController,
  expression: string,
): Promise<DevToolsResponse> {
  try {
    const result = await controller.executeScript(expression)
    
    return {
      success: true,
      data: {
        expression,
        result,
        type: typeof result,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Expression evaluation failed',
    }
  }
}

async function getDOMTree(
  controller: BrowserController,
  selector = 'body',
): Promise<DevToolsResponse> {
  try {
    const result = await controller.executeScript(`
      (() => {
        const root = document.querySelector('${selector}');
        const buildTree = (el, depth = 0) => {
          if (depth > 5) return null; // Limit depth
          
          return {
            tag: el.tagName.toLowerCase(),
            id: el.id || undefined,
            className: el.className || undefined,
            text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 
              ? el.textContent?.substring(0, 100)
              : undefined,
            children: Array.from(el.children)
              .slice(0, 10) // Limit children
              .map(child => buildTree(child, depth + 1)),
          };
        };
        
        return buildTree(root);
      })()
    `)
    
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'DOM tree retrieval failed',
    }
  }
}

async function measurePerformance(
  controller: BrowserController,
): Promise<DevToolsResponse> {
  try {
    const result = await controller.executeScript(`
      (() => {
        const paint = performance.getEntriesByType('paint');
        const navigation = performance.getEntriesByType('navigation')[0];
        
        return {
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
          domInteractive: navigation?.domInteractive,
          domComplete: navigation?.domComplete,
          loadComplete: navigation?.loadEventEnd,
          totalTime: navigation?.loadEventEnd,
          resourceCount: performance.getEntriesByType('resource').length,
        };
      })()
    `)
    
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Performance measurement failed',
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as DevToolsRequest
    const { sessionId, tool, params } = body
    
    // Validate session
    const controller = await getBrowserController(sessionId)
    if (!controller.isActive()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session not found or expired',
        } as DevToolsResponse,
        { status: 404 },
      )
    }
    
    let response: DevToolsResponse
    
    switch (tool) {
      case 'inspectElement':
        response = await inspectElement(controller, params.selector as string)
        break
      
      case 'getConsole':
        response = await getConsoleOutput(sessionId)
        break
      
      case 'clearConsole':
        response = await clearConsole(sessionId)
        break
      
      case 'getNetworkInfo':
        response = await getNetworkInfo(controller)
        break
      
      case 'evaluateExpression':
        response = await evaluateExpression(controller, params.expression as string)
        break
      
      case 'getDOMTree':
        response = await getDOMTree(controller, params.selector as string | undefined)
        break
      
      case 'measurePerformance':
        response = await measurePerformance(controller)
        break
      
      default:
        response = {
          success: false,
          error: `Unknown tool: ${tool}`,
        }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as DevToolsResponse,
      { status: 500 },
    )
  }
}

/**
 * List available DevTools
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    tools: [
      {
        name: 'inspectElement',
        description: 'Inspect element properties, styles, and attributes',
        params: { selector: 'string' },
      },
      {
        name: 'getConsole',
        description: 'Get console output logs',
        params: {},
      },
      {
        name: 'clearConsole',
        description: 'Clear console logs',
        params: {},
      },
      {
        name: 'getNetworkInfo',
        description: 'Get network timing and resource information',
        params: {},
      },
      {
        name: 'evaluateExpression',
        description: 'Evaluate JavaScript expression in page context',
        params: { expression: 'string' },
      },
      {
        name: 'getDOMTree',
        description: 'Get DOM tree structure',
        params: { selector: 'string (optional)' },
      },
      {
        name: 'measurePerformance',
        description: 'Measure page performance metrics',
        params: {},
      },
    ],
  })
}
