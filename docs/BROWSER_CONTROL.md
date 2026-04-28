# Browser Control Infrastructure

Complete browser automation system for the O.W.P.I.L Agent with **self-healing capabilities**, **Chrome DevTools integration**, and **fallback support**.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           BrowserControl (High-level API)           │
│  navigate, click, fill, getText, runTask, etc.      │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Browser    │ │   Browser    │ │    Chrome    │
│ Harness      │ │ Controller   │ │   DevTools   │
│(self-heal)   │ │(Playwright)  │ │   (inspect)  │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## Components

### 1. BrowserControl (High-level API)
**File:** `lib/agent/browser/control.ts`

Main entry point for all browser automation tasks.

```typescript
import { createBrowserControl } from '@/lib/agent/browser/control'

const browser = await createBrowserControl()
await browser.navigate('https://example.com')
await browser.click('button[aria-label="Login"]')
const title = await browser.getText('h1')
await browser.close()
```

**Key Methods:**
- `navigate(url)` — Navigate to URL with SSRF protection
- `click(selector)` — Click element with visibility check
- `fill(selector, value)` — Fill input with clear first
- `getText(selector?)` — Extract text content
- `screenshot()` — Capture page
- `waitFor(selector)` — Wait for element visibility
- `eval(script)` — Execute JS in page context
- `runTask(task)` — Execute multi-step task
- `getAccessibilitySnapshot()` — Get semantic structure

---

### 2. BrowserHarness (Self-healing)
**File:** `lib/agent/browser/harness.ts`

Wraps Playwright with automatic retry, visibility checks, and accessibility navigation.

**Features:**
- **Exponential backoff retry** — Configurable max retries and delays
- **Visibility checks** — Auto-scrolls elements into view
- **Accessibility snapshot** — Navigate by role, aria-label, text
- **Element stability** — Waits for DOM to stabilize before interaction
- **Network awareness** — Waits for page load completion

**Configuration:**
```typescript
const harness = new BrowserHarness(controller, {
  maxRetries: 3,        // Retry failed actions
  baseDelay: 500,       // Start delay (ms)
  maxDelay: 5000,       // Max delay (ms)
  visualDebug: true,    // Log screenshots
})
```

---

### 3. BrowserController (Playwright Wrapper)
**File:** `lib/agent/browser/controller.ts`

Low-level Playwright wrapper with **SSRF protection** and session management.

**Security:**
- Blocks private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
- Blocks cloud metadata services (AWS 169.254.169.254, GCP metadata.google.internal)
- Only allows HTTP/HTTPS protocols
- Session timeout (5 minutes of inactivity)

**Methods:**
- `navigate(url)` — Navigate with URL validation
- `click(selector)` — Click element
- `type(selector, text)` — Type into input
- `screenshot()` — Capture page
- `getContent()` — Extract HTML/text
- `executeScript(script)` — Run JavaScript
- `goBack()`, `goForward()`, `reload()`

---

### 4. Chrome DevTools MCP
**File:** `app/api/mcp/devtools/route.ts`

REST API for live browser inspection, debugging, and performance monitoring.

**Endpoint:** `POST /api/mcp/devtools`

**Available Tools:**

#### inspectElement
Inspect element properties, styles, and attributes.
```json
{
  "sessionId": "abc123",
  "tool": "inspectElement",
  "params": { "selector": "button.submit" }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "tagName": "BUTTON",
    "id": "submit-btn",
    "className": "submit",
    "innerText": "Sign In",
    "computedStyle": {
      "display": "block",
      "visibility": "visible",
      "opacity": "1"
    },
    "boundingBox": { "x": 100, "y": 200, "width": 80, "height": 40 },
    "ariaLabel": "Sign in to account",
    "role": "button"
  }
}
```

#### getConsole
Get console output logs (last 100).
```json
{
  "sessionId": "abc123",
  "tool": "getConsole",
  "params": {}
}
```

#### evaluateExpression
Evaluate JavaScript in page context.
```json
{
  "sessionId": "abc123",
  "tool": "evaluateExpression",
  "params": { "expression": "document.title" }
}
```

#### getDOMTree
Get semantic DOM tree structure.
```json
{
  "sessionId": "abc123",
  "tool": "getDOMTree",
  "params": { "selector": "body" }
}
```

#### measurePerformance
Get page performance metrics (FCP, LCP, load time).
```json
{
  "sessionId": "abc123",
  "tool": "measurePerformance",
  "params": {}
}
```

#### getNetworkInfo
Get network timing and resource info.

#### clearConsole
Clear console logs.

---

## Usage Patterns

### Simple Navigation & Click
```typescript
const browser = await createBrowserControl()

await browser.navigate('https://example.com')
await browser.click('a[href="/login"]')
await browser.fill('input[type="email"]', 'user@example.com')
await browser.fill('input[type="password"]', 'password123')
await browser.click('button[type="submit"]')

const message = await browser.getText('.success-message')
console.log(message)

await browser.close()
```

### Multi-step Task
```typescript
const task = {
  name: 'Login and verify',
  steps: [
    { action: 'navigate', value: 'https://example.com/login' },
    { action: 'fill', selector: 'input[type="email"]', value: 'user@example.com' },
    { action: 'fill', selector: 'input[type="password"]', value: 'password' },
    { action: 'click', selector: 'button[type="submit"]' },
    { action: 'wait', selector: '.dashboard', timeout: 10000 },
    { action: 'screenshot' },
    { action: 'getText', selector: 'h1' },
  ],
  timeout: 30000,
}

const result = await browser.runTask(task)
console.log(result.success ? 'Task passed' : 'Task failed')
result.steps.forEach(step => {
  console.log(`${step.action}: ${step.success ? '✓' : '✗'} (${step.duration}ms)`)
})
```

### Accessibility-based Navigation
```typescript
// Find and interact using accessibility tree
const snapshot = await browser.getAccessibilitySnapshot()
// snapshot contains roles, aria-labels, and text content

await browser.click({
  role: 'button',
  text: 'Sign In',
})

// Or by aria-label
await browser.click({
  ariaLabel: 'Close dialog',
})
```

### DevTools Inspection
```typescript
const response = await fetch('/api/mcp/devtools', {
  method: 'POST',
  body: JSON.stringify({
    sessionId: 'abc123',
    tool: 'inspectElement',
    params: { selector: 'button.submit' },
  }),
})

const { data } = await response.json()
console.log('Element found:', data.innerText, data.computedStyle)
```

---

## Error Handling & Recovery

### Automatic Retry with Backoff
The BrowserHarness automatically retries failed actions with exponential backoff:

```
Attempt 1: immediate
Attempt 2: 500ms delay
Attempt 3: 1000ms delay
Attempt 4: 2000ms delay
Attempt 5: 5000ms (max)
```

### Visibility Checks
If an element is not visible, it's automatically scrolled into view:

```typescript
// Even if button is off-screen, this will work
await browser.click('button.load-more')
// (auto-scrolls into view internally)
```

### Custom Wait Conditions
```typescript
await browser.waitFor('input.username') // Wait for element
await browser.eval(`
  new Promise(resolve => {
    const check = setInterval(() => {
      if (document.querySelector('.authenticated')) {
        clearInterval(check)
        resolve()
      }
    }, 100)
  })
`)
```

---

## Security Considerations

### SSRF Protection
The BrowserController enforces strict URL validation:

✅ Allowed:
- `https://example.com`
- `https://api.example.com/endpoint`
- `http://public-service.com`

❌ Blocked:
- `http://localhost:8080`
- `http://127.0.0.1`
- `http://192.168.1.1` (private IP)
- `http://169.254.169.254` (AWS metadata)
- `file:///etc/passwd`

### Session Isolation
- Each session gets a separate browser context
- Sessions timeout after 5 minutes of inactivity
- All sessions can be closed with `closeAllSessions()`

### Sandboxing
Future: WASM sandbox integration (IronClaw-inspired) for:
- Running untrusted automation scripts
- Capability-based permissions
- Isolated DOM access

---

## Tool Selection Guide

| Task | Tool | Reason |
|------|------|--------|
| Simple navigation | BrowserControl.navigate() | Direct, high-level |
| Element interaction | BrowserControl.click() | Auto-retry, visibility checks |
| Form filling | BrowserControl.fill() | Clears first, stability check |
| Debugging element | DevTools inspectElement | Live CSS/attributes |
| Performance audit | DevTools measurePerformance | Real metrics |
| DOM navigation | BrowserControl.getAccessibilitySnapshot() | Semantic, accessible |
| Complex task | BrowserControl.runTask() | Tracks all steps, screenshots |

---

## Troubleshooting

### "Element not found"
1. Check selector syntax (CSS or accessibility)
2. Wait for element: `await browser.waitFor(selector)`
3. Get accessibility snapshot to find correct selectors
4. Check if element is in iframe (not supported yet)

### "Navigation timeout"
1. Increase timeout: `await browser.waitFor(selector, 30000)`
2. Check network connectivity
3. Verify URL is correct and accessible
4. Check for SSRF blocks (private IPs)

### "Browser crashed"
1. Session likely timed out (5 min inactivity)
2. Create new BrowserControl instance
3. Check server logs for Playwright errors

### Performance Issues
1. Take fewer screenshots (expensive)
2. Limit DOM tree depth
3. Use selector instead of text matching
4. Close unused browser sessions

---

## Testing

Run smoke tests:
```bash
npm run test:browser-control
```

Test file: `scripts/test-browser-control.ts`

---

## Future Enhancements

- [ ] Iframe support
- [ ] Mobile device emulation
- [ ] Request/response interception
- [ ] Cookie/localStorage management
- [ ] File upload/download
- [ ] WebSocket support
- [ ] Selenium fallback
- [ ] Browser pool for parallel tasks
