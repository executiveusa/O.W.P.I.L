# Browser Automation Quick Start

Get up and running with O.W.P.I.L's browser automation in 5 minutes.

---

## Installation

```bash
# Dependencies are already in package.json
npm install

# Optional: Run smoke tests
npm run test:browser-control
```

---

## Basic Usage

### Simple Navigation and Click

```typescript
import { createBrowserControl } from '@/lib/agent/browser/control'

const browser = await createBrowserControl()

// Navigate to page
await browser.navigate('https://example.com')

// Click button
await browser.click('button.submit')

// Get text
const result = await browser.getText('.result')
console.log(result)

// Close
await browser.close()
```

### Form Filling

```typescript
await browser.navigate('https://example.com/login')

// Fill email
await browser.fill('input[type="email"]', 'user@example.com')

// Fill password
await browser.fill('input[type="password"]', 'password123')

// Click submit
await browser.click('button[type="submit"]')

// Wait for result
await browser.waitFor('.dashboard', 10000)

// Take screenshot
const screenshot = await browser.screenshot()
```

### Multi-step Task

```typescript
import type { BrowserTask } from '@/lib/agent/browser/control'

const task: BrowserTask = {
  name: 'Login and verify profile',
  description: 'Test login workflow',
  steps: [
    {
      action: 'navigate',
      value: 'https://example.com/login',
    },
    {
      action: 'fill',
      selector: 'input[type="email"]',
      value: 'user@example.com',
    },
    {
      action: 'fill',
      selector: 'input[type="password"]',
      value: 'password123',
    },
    {
      action: 'click',
      selector: 'button[type="submit"]',
    },
    {
      action: 'wait',
      selector: '.profile-header',
      timeout: 10000,
    },
    {
      action: 'getText',
      selector: 'h1',
    },
    {
      action: 'screenshot',
    },
  ],
  timeout: 30000,
}

const result = await browser.runTask(task)

console.log(`Task: ${result.success ? '✓ Passed' : '✗ Failed'}`)
result.steps.forEach(step => {
  console.log(`  ${step.action}: ${step.success ? '✓' : '✗'} (${step.duration}ms)`)
})
```

---

## Agent Skills

Use browser automation directly in agent prompts:

```typescript
import { skillRegistry } from '@/lib/agent/skills/skill-registry'

// Register skills automatically (done on import)
const skills = skillRegistry.getByCategory('browser')

console.log(`Available browser skills: ${skills.length}`)
skills.forEach(s => console.log(`  - ${s.name}`))
```

### Available Skills

| Skill | Description |
|-------|-------------|
| `browser-navigate` | Navigate to URL |
| `browser-click` | Click element |
| `browser-fill` | Fill input field |
| `browser-get-text` | Extract text content |
| `browser-screenshot` | Capture page screenshot |
| `browser-run-task` | Execute multi-step task |
| `browser-accessibility` | Get accessibility tree |
| `browser-close` | Close session |

---

## DevTools Inspection

Debug page state with Chrome DevTools MCP:

```typescript
// Inspect element
const response = await fetch('/api/mcp/devtools', {
  method: 'POST',
  body: JSON.stringify({
    sessionId: 'abc123',
    tool: 'inspectElement',
    params: { selector: 'button.submit' },
  }),
})

const { data } = await response.json()
console.log('Element:', data.innerText, data.computedStyle.display)

// Get performance metrics
const perf = await fetch('/api/mcp/devtools', {
  method: 'POST',
  body: JSON.stringify({
    sessionId: 'abc123',
    tool: 'measurePerformance',
    params: {},
  }),
})

const metrics = await perf.json()
console.log(`FCP: ${metrics.data.firstContentfulPaint}ms`)
```

---

## Error Handling

### Automatic Retry
Actions automatically retry with exponential backoff:

```typescript
// This will retry up to 3 times automatically
await browser.click('button.dynamic') // Appears after 1 second
```

### Custom Retries
For operations not using the harness:

```typescript
async function retryClick(selector: string, maxTries = 3) {
  for (let i = 0; i < maxTries; i++) {
    try {
      await browser.click(selector)
      return
    } catch (error) {
      if (i === maxTries - 1) throw error
      await new Promise(r => setTimeout(r, 500 * Math.pow(2, i)))
    }
  }
}
```

### Wait for Stability
```typescript
// Wait for element to appear and stabilize
await browser.waitFor('.dynamic-content', 10000)

// Custom wait condition
await browser.eval(`
  new Promise(resolve => {
    const check = setInterval(() => {
      if (document.readyState === 'complete' && 
          !document.querySelector('.loading')) {
        clearInterval(check)
        resolve()
      }
    }, 100)
  })
`)
```

---

## Tips & Tricks

### Use Accessibility Snapshots
Instead of guessing selectors, get the actual page structure:

```typescript
const snapshot = await browser.getAccessibilitySnapshot()
console.log(snapshot) // Shows all interactive elements with labels

// Then use aria-label or role to find elements
await browser.click({
  role: 'button',
  text: 'Sign In',
})
```

### Take Screenshots for Debugging
```typescript
const screenshot = await browser.screenshot()

// Send to external service or save
const img = Buffer.from(screenshot.replace('data:image/png;base64,', ''), 'base64')
fs.writeFileSync('screenshot.png', img)
```

### Extract Dynamic Content
```typescript
// Wait for specific text to appear
const text = await browser.getText()
if (!text.includes('Success')) {
  throw new Error('Success message not found')
}

// Extract JSON from page
const data = await browser.eval(`
  JSON.parse(document.querySelector('[data-json]').textContent)
`)
```

### Handle Modals/Alerts
```typescript
// Wait for modal to appear
await browser.waitFor('.modal', 5000)

// Click button in modal
await browser.click('.modal button.confirm')

// Wait for modal to close
await browser.waitFor('.modal', 1000).catch(() => {
  // Modal closed, that's fine
})
```

---

## Common Patterns

### Login Workflow
```typescript
async function login(browser: BrowserControl, email: string, password: string) {
  await browser.navigate('https://app.example.com/login')
  await browser.fill('input[name="email"]', email)
  await browser.fill('input[name="password"]', password)
  await browser.click('button[type="submit"]')
  await browser.waitFor('.dashboard', 10000)
}
```

### Form Submission
```typescript
async function submitForm(browser: BrowserControl, formData: Record<string, string>) {
  for (const [field, value] of Object.entries(formData)) {
    const selector = `input[name="${field}"]`
    await browser.fill(selector, value)
  }
  await browser.click('button[type="submit"]')
}
```

### Extract Table Data
```typescript
const rows = await browser.eval(`
  Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
    const cells = tr.querySelectorAll('td')
    return {
      id: cells[0]?.textContent,
      name: cells[1]?.textContent,
      status: cells[2]?.textContent,
    }
  })
`)
console.log(rows)
```

### Handle Pagination
```typescript
async function getAllPages(browser: BrowserControl) {
  const allItems = []
  
  while (true) {
    // Extract items from current page
    const items = await browser.eval(`
      Array.from(document.querySelectorAll('.item')).map(el => el.textContent)
    `)
    allItems.push(...items)
    
    // Try to go to next page
    try {
      await browser.click('a[rel="next"]')
      await browser.waitFor('.item', 5000)
    } catch {
      break // No more pages
    }
  }
  
  return allItems
}
```

---

## Security Notes

✅ **Safe to use with untrusted URLs** — SSRF protection blocks:
- Private IPs (10.0.0.0/8, 192.168.0.0/16)
- Localhost and 127.0.0.1
- Cloud metadata endpoints (AWS, GCP, Alibaba)
- File protocol (file://)

❌ **Unsafe patterns:**
- Don't pass user input directly to `executeScript` without escaping
- Don't log sensitive data (passwords, tokens)
- Don't store credentials in browser (use environment variables)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Element not found" | Use `getAccessibilitySnapshot()` to find correct selector |
| "Navigation timeout" | Check URL is valid, increase timeout, check network |
| "Browser crashed" | Session expired (5 min timeout), create new instance |
| "SSRF blocked" | URL uses private IP, use public URL instead |
| "Screenshot empty" | Page still loading, add `waitFor()` before screenshot |

---

## Next Steps

- Read [BROWSER_CONTROL.md](./BROWSER_CONTROL.md) for full API documentation
- Run smoke tests: `npm run test:browser-control`
- Check out agent skill examples in `/lib/agent/skills/built-in/browser-automation-skills.ts`
- Use DevTools for debugging: `POST /api/mcp/devtools`
