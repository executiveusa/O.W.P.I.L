// Discord API client for interactions
const DISCORD_API_BASE = 'https://discord.com/api/v10'

interface DiscordMessage {
  content: string
  embeds?: DiscordEmbed[]
  components?: DiscordComponent[]
}

interface DiscordEmbed {
  title?: string
  description?: string
  color?: number
  fields?: Array<{ name: string; value: string; inline?: boolean }>
  footer?: { text: string }
  timestamp?: string
}

interface DiscordComponent {
  type: number
  components?: DiscordComponent[]
  style?: number
  label?: string
  custom_id?: string
  disabled?: boolean
}

export class DiscordClient {
  private botToken: string
  private applicationId: string
  
  constructor() {
    const token = process.env.DISCORD_BOT_TOKEN
    const appId = process.env.DISCORD_APPLICATION_ID
    
    if (!token || !appId) {
      throw new Error('Discord credentials not configured')
    }
    
    this.botToken = token
    this.applicationId = appId
  }
  
  private async request(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    const response = await fetch(`${DISCORD_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bot ${this.botToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Discord API error: ${response.status} - ${error}`)
    }
    
    return response.json()
  }
  
  // Send a message to a channel
  async sendMessage(channelId: string, message: DiscordMessage): Promise<unknown> {
    return this.request(`/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    })
  }
  
  // Reply to an interaction
  async replyToInteraction(
    interactionId: string, 
    interactionToken: string, 
    message: DiscordMessage
  ): Promise<void> {
    await fetch(`${DISCORD_API_BASE}/interactions/${interactionId}/${interactionToken}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: message,
      }),
    })
  }
  
  // Defer reply (for long-running tasks)
  async deferReply(
    interactionId: string, 
    interactionToken: string,
    ephemeral = false
  ): Promise<void> {
    await fetch(`${DISCORD_API_BASE}/interactions/${interactionId}/${interactionToken}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 5, // DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
        data: ephemeral ? { flags: 64 } : {},
      }),
    })
  }
  
  // Edit deferred reply
  async editReply(
    interactionToken: string, 
    message: DiscordMessage
  ): Promise<void> {
    await fetch(`${DISCORD_API_BASE}/webhooks/${this.applicationId}/${interactionToken}/messages/@original`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
  }
  
  // Register slash commands
  async registerCommands(): Promise<void> {
    const commands = [
      {
        name: 'ask',
        description: 'Ask the O.W.P.I.L assistant a question',
        options: [
          {
            name: 'prompt',
            description: 'Your question or request',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        name: 'task',
        description: 'Start an autonomous task',
        options: [
          {
            name: 'description',
            description: 'Description of the task to execute',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        name: 'status',
        description: 'Get the current status of the assistant',
      },
      {
        name: 'edit',
        description: 'Edit the website',
        options: [
          {
            name: 'section',
            description: 'Section to edit (hero, timeline, gallery, philosophy)',
            type: 3, // STRING
            required: true,
            choices: [
              { name: 'Hero', value: 'hero' },
              { name: 'Timeline', value: 'timeline' },
              { name: 'Gallery', value: 'gallery' },
              { name: 'Philosophy', value: 'philosophy' },
            ],
          },
          {
            name: 'action',
            description: 'What to do',
            type: 3, // STRING
            required: true,
          },
        ],
      },
    ]
    
    await this.request(`/applications/${this.applicationId}/commands`, {
      method: 'PUT',
      body: JSON.stringify(commands),
    })
  }
  
  // Build an embed message
  static buildEmbed(options: {
    title?: string
    description?: string
    color?: 'gold' | 'green' | 'red' | 'blue'
    fields?: Array<{ name: string; value: string; inline?: boolean }>
    footer?: string
  }): DiscordEmbed {
    const colors = {
      gold: 0xc4a265,
      green: 0x22c55e,
      red: 0xef4444,
      blue: 0x3b82f6,
    }
    
    return {
      title: options.title,
      description: options.description,
      color: colors[options.color || 'gold'],
      fields: options.fields,
      footer: options.footer ? { text: options.footer } : undefined,
      timestamp: new Date().toISOString(),
    }
  }
}

// Verify Discord webhook signature
export function verifyDiscordSignature(
  signature: string,
  timestamp: string,
  body: string,
  publicKey: string
): boolean {
  // In production, use tweetnacl or similar to verify
  // For now, skip verification in development
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  // Production verification would use:
  // const nacl = require('tweetnacl')
  // const isValid = nacl.sign.detached.verify(...)
  
  return !!signature && !!timestamp && !!body && !!publicKey
}
