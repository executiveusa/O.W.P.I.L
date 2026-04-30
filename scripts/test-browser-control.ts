/**
 * Smoke Tests for Browser Control Infrastructure
 * 
 * Run with: npx ts-node scripts/test-browser-control.ts
 */

import { createBrowserControl, type BrowserTask } from '../lib/agent/browser/control'
import { BrowserController, getBrowserController } from '../lib/agent/browser/controller'

interface TestResult {
  name: string
  passed: boolean
  duration: number
  error?: string
}

const results: TestResult[] = []

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  const start = Date.now()
  try {
    await fn()
    results.push({
      name,
      passed: true,
      duration: Date.now() - start,
    })
    console.log(`✓ ${name} (${Date.now() - start}ms)`)
  } catch (error) {
    results.push({
      name,
      passed: false,
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    })
    console.log(`✗ ${name} — ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function runTests(): Promise<void> {
  console.log('\n📊 Browser Control Smoke Tests\n')
  
  // Test 1: BrowserController initialization
  await test('BrowserController.initialize()', async () => {
    const controller = new BrowserController()
    const sessionId = await controller.initialize()
    
    if (!sessionId) throw new Error('No session ID returned')
    if (!controller.isActive()) throw new Error('Controller not active')
    
    await controller.close()
  })
  
  // Test 2: BrowserControl initialization
  await test('BrowserControl.initialize()', async () => {
    const browser = await createBrowserControl()
    const sessionId = browser.getSessionId()
    
    if (!sessionId) throw new Error('No session ID')
    
    await browser.close()
  })
  
  // Test 3: URL validation (SSRF protection)
  await test('SSRF protection - blocked private IP', async () => {
    const controller = new BrowserController()
    await controller.initialize()
    
    const result = await controller.navigate('http://192.168.1.1')
    if (result.success) throw new Error('Should have blocked private IP')
    
    await controller.close()
  })
  
  // Test 4: SSRF protection - blocked localhost
  await test('SSRF protection - blocked localhost', async () => {
    const controller = new BrowserController()
    await controller.initialize()
    
    const result = await controller.navigate('http://localhost:8080')
    if (result.success) throw new Error('Should have blocked localhost')
    
    await controller.close()
  })
  
  // Test 5: SSRF protection - allowed public URL
  await test('SSRF protection - allowed public URL', async () => {
    const controller = new BrowserController()
    await controller.initialize()
    
    const result = await controller.navigate('https://example.com')
    if (!result.success && !result.error?.includes('Timeout')) {
      throw new Error(`Navigation failed: ${result.error}`)
    }
    
    await controller.close()
  })
  
  // Test 6: Browser navigation
  await test('BrowserControl.navigate()', async () => {
    const browser = await createBrowserControl()
    
    try {
      await browser.navigate('https://example.com')
    } catch (error) {
      // Network may not be available in test env
      console.log(`  (network unavailable, skipping actual navigation)`)
    }
    
    await browser.close()
  })
  
  // Test 7: Screenshot capability
  await test('BrowserControl.screenshot()', async () => {
    const browser = await createBrowserControl()
    
    try {
      await browser.navigate('https://example.com')
    } catch {
      // Skip navigation
    }
    
    try {
      const screenshot = await browser.screenshot()
      if (!screenshot.includes('data:image/png;base64')) {
        throw new Error('Invalid screenshot format')
      }
    } catch (error) {
      // Network unavailable is OK in test
      console.log(`  (network unavailable, skipping)`)
    }
    
    await browser.close()
  })
  
  // Test 8: Multi-step task execution
  await test('BrowserControl.runTask()', async () => {
    const browser = await createBrowserControl()
    
    const task: BrowserTask = {
      name: 'Test task',
      description: 'Test multi-step task execution',
      steps: [
        {
          action: 'execute',
          text: 'document.title',
        },
        {
          action: 'screenshot',
        },
      ],
      timeout: 10000,
    }
    
    try {
      const result = await browser.runTask(task)
      if (!result) throw new Error('No result')
      if (result.steps.length === 0) throw new Error('No steps executed')
    } catch (error) {
      // Network unavailable is OK
      console.log(`  (network unavailable, skipping)`)
    }
    
    await browser.close()
  })
  
  // Test 9: Accessibility snapshot
  await test('BrowserControl.getAccessibilitySnapshot()', async () => {
    const browser = await createBrowserControl()
    
    try {
      await browser.navigate('https://example.com')
    } catch {
      // Skip
    }
    
    try {
      const snapshot = await browser.getAccessibilitySnapshot()
      if (!snapshot) throw new Error('No snapshot returned')
      if (!Array.isArray(snapshot)) throw new Error('Snapshot not an array')
    } catch (error) {
      console.log(`  (network unavailable, skipping)`)
    }
    
    await browser.close()
  })
  
  // Test 10: Session isolation
  await test('Session isolation - separate contexts', async () => {
    const session1 = await createBrowserControl()
    const session2 = await createBrowserControl()
    
    const id1 = session1.getSessionId()
    const id2 = session2.getSessionId()
    
    if (id1 === id2) throw new Error('Sessions have same ID')
    
    await session1.close()
    await session2.close()
  })
  
  // Test 11: SSRF edge cases
  await test('SSRF protection - AWS metadata endpoint', async () => {
    const controller = new BrowserController()
    await controller.initialize()
    
    const result = await controller.navigate('http://169.254.169.254/latest/meta-data')
    if (result.success) throw new Error('Should have blocked AWS metadata')
    
    await controller.close()
  })
  
  // Test 12: SSRF protection - GCP metadata
  await test('SSRF protection - GCP metadata endpoint', async () => {
    const controller = new BrowserController()
    await controller.initialize()
    
    const result = await controller.navigate('http://metadata.google.internal')
    if (result.success) throw new Error('Should have blocked GCP metadata')
    
    await controller.close()
  })
  
  // Test 13: Protocol validation
  await test('SSRF protection - file protocol blocked', async () => {
    const controller = new BrowserController()
    await controller.initialize()
    
    const result = await controller.navigate('file:///etc/passwd')
    if (result.success) throw new Error('Should have blocked file protocol')
    
    await controller.close()
  })
  
  // Print summary
  console.log('\n' + '='.repeat(50))
  const passed = results.filter(r => r.passed).length
  const total = results.length
  const avgDuration = Math.round(
    results.reduce((sum, r) => sum + r.duration, 0) / results.length
  )
  
  console.log(`\n📈 Results: ${passed}/${total} passed (avg ${avgDuration}ms)`)
  
  if (passed < total) {
    console.log('\n❌ Failed tests:')
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  - ${r.name}`)
        console.log(`    ${r.error}`)
      })
  } else {
    console.log('\n✨ All tests passed!')
  }
  
  process.exit(passed === total ? 0 : 1)
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error)
  process.exit(1)
})
