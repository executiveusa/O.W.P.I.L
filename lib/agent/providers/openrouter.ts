import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { AGENT_CONFIG, type AgentModel } from '../config'

// Initialize OpenRouter client
export function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set')
  }
  
  return createOpenRouter({
    apiKey,
  })
}

// Get a specific model
export function getModel(modelKey: AgentModel = 'hermes') {
  const openrouter = getOpenRouterClient()
  const modelId = AGENT_CONFIG.models[modelKey]
  return openrouter(modelId)
}

// Get the default model
export function getDefaultModel() {
  const openrouter = getOpenRouterClient()
  return openrouter(AGENT_CONFIG.defaultModel)
}

// Available models for UI selection
export function getAvailableModels() {
  return Object.entries(AGENT_CONFIG.models).map(([key, id]) => ({
    key,
    id,
    name: id.split('/')[1] || id,
    provider: id.split('/')[0] || 'unknown',
  }))
}
