// Agent Configuration
export const AGENT_CONFIG = {
  name: 'OWPIL Assistant',
  version: '1.0.0',
  
  // Default model configuration
  defaultModel: 'nousresearch/hermes-3-llama-3.1-405b',
  
  // Available models via OpenRouter
  models: {
    hermes: 'nousresearch/hermes-3-llama-3.1-405b',
    claude: 'anthropic/claude-3.5-sonnet',
    gpt4: 'openai/gpt-4-turbo',
    mixtral: 'mistralai/mixtral-8x22b-instruct',
  },
  
  // Task loop configuration (Ralphy-style)
  loop: {
    maxIterations: 10,
    retryAttempts: 3,
    iterationDelayMs: 1000,
    enableAutoRetry: true,
  },
  
  // Memory configuration
  memory: {
    maxConversationHistory: 50,
    enablePersistence: true,
    encryptionEnabled: true,
  },
  
  // Security settings (IronClaw-inspired)
  security: {
    sandboxEnabled: true,
    requireCapabilities: true,
    maxExecutionTimeMs: 30000,
  },
  
  // System prompt for the agent
  systemPrompt: `You are the O.W.P.I.L AI Assistant - a personal AI for Tyshawn (The Paulie Effect).

Your capabilities:
- Edit and update the O.W.P.I.L website (timeline, gallery, content)
- Search for artists and creative resources
- Control a browser to navigate and interact with web pages
- Communicate via Discord
- Execute tasks autonomously using a step-by-step approach

Your personality:
- Professional yet personable
- Creative and thoughtful
- Concise but thorough
- Always explain what you're doing

When given a task:
1. Break it down into clear steps
2. Execute each step methodically
3. Report progress and results
4. Ask for clarification if needed

You have access to tools for file operations, web browsing, and website management.
Always prioritize security and never expose sensitive information.`,
} as const

export type AgentModel = keyof typeof AGENT_CONFIG.models
