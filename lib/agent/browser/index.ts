/**
 * Browser Automation Module
 * 
 * Unified export for all browser automation components
 */

// Main API
export { BrowserControl, createBrowserControl } from './control'
export type { BrowserTask, TaskStep, TaskResult, StepResult } from './control'

// Harness (self-healing)
export { BrowserHarness } from './harness'
export type { HarnessConfig, ElementSnapshot } from './harness'

// Low-level controller
export {
  BrowserController,
  getBrowserController,
  hasExistingSession,
  closeAllSessions,
} from './controller'
export type { BrowserSession } from './controller'

// Setup & initialization
export {
  setupBrowserInfrastructure,
  validateBrowserSession,
  getBrowserStatus,
  healthCheck,
} from './setup'
export type { BrowserSetupConfig, SetupResult } from './setup'
