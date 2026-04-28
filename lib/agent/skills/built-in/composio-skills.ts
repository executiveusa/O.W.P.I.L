import type { AgentSkill } from '../types'

/**
 * Composio Integration Skills
 * 
 * Composio provides managed OAuth + unified tool routing for 500+ integrations
 * including Gmail, GitHub, Slack, Notion, Salesforce, HubSpot, Linear, and more.
 * 
 * These skills let Sensei:
 * - Search and connect to any Composio toolkit
 * - Route actions through Composio's auth gateway
 * - Execute actions on Gmail, GitHub, Slack, Notion, etc. without managing keys
 */

export const composioSkills: AgentSkill[] = [
  {
    id: 'composio_list_integrations',
    name: 'List Available Integrations',
    description: 'Search and discover all available Composio integrations (Gmail, GitHub, Slack, Notion, Salesforce, HubSpot, Linear, Stripe, etc.)',
    category: 'integration',
    schema: {
      search: { type: 'string', description: 'Optional search term (e.g., "Gmail" or "Slack")' },
      limit: { type: 'number', description: 'Max results to return (default: 20)' },
    },
    execute: async (args: Record<string, unknown>) => {
      const { search = '', limit = 20 } = args
      try {
        const response = await fetch(`${process.env.COMPOSIO_API_URL || 'https://api.composio.dev'}/integrations`, {
          headers: {
            'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })
        if (!response.ok) throw new Error(`Composio API error: ${response.statusText}`)
        const data = await response.json() as Record<string, unknown>
        const results = (data.integrations as Array<{name: string, description: string}> || [])
          .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))
          .slice(0, limit as number)
        return { count: results.length, integrations: results }
      } catch (error) {
        return { error: `Failed to list integrations: ${error instanceof Error ? error.message : 'unknown error'}` }
      }
    },
  },

  {
    id: 'composio_connect',
    name: 'Connect to Integration',
    description: 'Initiate OAuth flow or connect to a Composio integration (Gmail, GitHub, Slack, Notion, etc.)',
    category: 'integration',
    schema: {
      integration_name: { type: 'string', description: 'Name of the integration (e.g., "gmail", "slack", "github")' },
      user_id: { type: 'string', description: 'Optional user ID to associate with this connection' },
    },
    execute: async (args: Record<string, unknown>) => {
      const { integration_name, user_id } = args
      try {
        const response = await fetch(`${process.env.COMPOSIO_API_URL || 'https://api.composio.dev'}/integrations/${integration_name}/auth`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user_id || 'default' }),
        })
        if (!response.ok) throw new Error(`Connection failed: ${response.statusText}`)
        const data = await response.json() as {auth_url?: string, status?: string}
        return {
          status: 'connected',
          integration: integration_name,
          auth_url: data.auth_url,
          message: `${integration_name} connected successfully`,
        }
      } catch (error) {
        return { error: `Failed to connect: ${error instanceof Error ? error.message : 'unknown error'}` }
      }
    },
  },

  {
    id: 'composio_list_actions',
    name: 'List Actions for Integration',
    description: 'Get all available actions for a connected integration (e.g., send_email for Gmail, create_issue for GitHub)',
    category: 'integration',
    schema: {
      integration_name: { type: 'string', description: 'Integration name (e.g., "gmail", "github", "slack")' },
      limit: { type: 'number', description: 'Max actions to return (default: 50)' },
    },
    execute: async (args: Record<string, unknown>) => {
      const { integration_name, limit = 50 } = args
      try {
        const response = await fetch(
          `${process.env.COMPOSIO_API_URL || 'https://api.composio.dev'}/integrations/${integration_name}/actions?limit=${limit}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!response.ok) throw new Error(`Failed to fetch actions: ${response.statusText}`)
        const data = await response.json() as {actions?: Array<{name: string, description: string}>}
        return { integration: integration_name, actions: data.actions || [] }
      } catch (error) {
        return { error: `Failed to list actions: ${error instanceof Error ? error.message : 'unknown error'}` }
      }
    },
  },

  {
    id: 'composio_execute_action',
    name: 'Execute Integration Action',
    description: 'Execute an action on a Composio integration (e.g., send_email via Gmail, create_issue via GitHub, post_message via Slack)',
    category: 'integration',
    schema: {
      integration_name: { type: 'string', description: 'Integration name' },
      action_name: { type: 'string', description: 'Action name (e.g., "send_email", "create_issue", "post_message")' },
      parameters: { type: 'object', description: 'Action parameters as JSON (e.g., {to, subject, body} for send_email)' },
    },
    execute: async (args: Record<string, unknown>) => {
      const { integration_name, action_name, parameters } = args
      try {
        const response = await fetch(
          `${process.env.COMPOSIO_API_URL || 'https://api.composio.dev'}/integrations/${integration_name}/actions/${action_name}/execute`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(parameters),
          }
        )
        if (!response.ok) throw new Error(`Action failed: ${response.statusText}`)
        const data = await response.json() as {result?: unknown, status?: string}
        return { status: 'success', result: data.result }
      } catch (error) {
        return { error: `Failed to execute action: ${error instanceof Error ? error.message : 'unknown error'}` }
      }
    },
  },

  {
    id: 'composio_get_connected_accounts',
    name: 'Get Connected Accounts',
    description: 'List all user-connected accounts across integrations',
    category: 'integration',
    schema: {
      user_id: { type: 'string', description: 'User ID (default: "default")' },
    },
    execute: async (args: Record<string, unknown>) => {
      const { user_id = 'default' } = args
      try {
        const response = await fetch(
          `${process.env.COMPOSIO_API_URL || 'https://api.composio.dev'}/users/${user_id}/connections`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!response.ok) throw new Error(`Failed to fetch accounts: ${response.statusText}`)
        const data = await response.json() as {connections?: Array<{integration: string, status: string}>}
        return { user_id, connections: data.connections || [] }
      } catch (error) {
        return { error: `Failed to get connected accounts: ${error instanceof Error ? error.message : 'unknown error'}` }
      }
    },
  },

  {
    id: 'composio_disconnect',
    name: 'Disconnect Integration',
    description: 'Revoke and disconnect from a Composio integration',
    category: 'integration',
    schema: {
      integration_name: { type: 'string', description: 'Integration name' },
      user_id: { type: 'string', description: 'User ID (default: "default")' },
    },
    execute: async (args: Record<string, unknown>) => {
      const { integration_name, user_id = 'default' } = args
      try {
        const response = await fetch(
          `${process.env.COMPOSIO_API_URL || 'https://api.composio.dev'}/users/${user_id}/connections/${integration_name}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!response.ok) throw new Error(`Disconnect failed: ${response.statusText}`)
        return { status: 'disconnected', integration: integration_name }
      } catch (error) {
        return { error: `Failed to disconnect: ${error instanceof Error ? error.message : 'unknown error'}` }
      }
    },
  },
]
