/**
 * MCP (Model Context Protocol) Server — O.W.P.I.L
 * Exposes all agent skills as MCP tools so any MCP-compatible
 * client (Claude Desktop, Cursor, Windsurf, etc.) can control
 * the site and agent via the standard protocol.
 */
import { type NextRequest, NextResponse } from 'next/server'
import { skillRegistry } from '@/lib/agent/skills/skill-registry'

// MCP protocol version
const MCP_VERSION = '2024-11-05'

type MCPRequest = {
  jsonrpc: '2.0'
  id: string | number
  method: string
  params?: Record<string, unknown>
}

function mcpResponse(id: string | number, result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', id, result })
}

function mcpError(id: string | number, code: number, message: string) {
  return NextResponse.json({ jsonrpc: '2.0', id, error: { code, message } }, { status: 200 })
}

export async function POST(request: NextRequest) {
  // Optional bearer token auth
  const secret = process.env.MCP_SECRET
  if (secret) {
    const auth = request.headers.get('authorization') ?? ''
    if (!auth.startsWith('Bearer ') || auth.slice(7) !== secret) {
      return mcpError(0, -32001, 'Unauthorized — set MCP_SECRET env var to match')
    }
  }

  let body: MCPRequest
  try {
    body = await request.json()
  } catch {
    return mcpError(0, -32700, 'Parse error — invalid JSON')
  }

  const { id, method, params } = body

  // ------- MCP Methods -------

  // initialize — client handshake
  if (method === 'initialize') {
    return mcpResponse(id, {
      protocolVersion: MCP_VERSION,
      capabilities: { tools: {} },
      serverInfo: {
        name: 'owpil-mcp',
        version: '1.0.0',
        description: 'O.W.P.I.L MCP Server — Tyshawn Morehead personal assistant and site control',
      },
    })
  }

  // tools/list — enumerate all registered skills
  if (method === 'tools/list') {
    const tools = skillRegistry.getAll().map(skill => ({
      name: skill.id,
      description: skill.description,
      inputSchema: {
        type: 'object',
        properties: skill.schema ?? {},
      },
    }))
    return mcpResponse(id, { tools })
  }

  // tools/call — invoke a skill
  if (method === 'tools/call') {
    const name = params?.name as string
    const args = (params?.arguments ?? {}) as Record<string, unknown>

    if (!name) return mcpError(id, -32602, 'Missing tool name')

    const skill = skillRegistry.get(name)
    if (!skill) return mcpError(id, -32602, `Unknown tool: ${name}`)

    try {
      const output = await skill.execute(args)
      return mcpResponse(id, {
        content: [{ type: 'text', text: typeof output === 'string' ? output : JSON.stringify(output, null, 2) }],
      })
    } catch (err) {
      return mcpError(id, -32000, String(err))
    }
  }

  // resources/list — site pages as readable resources
  if (method === 'resources/list') {
    return mcpResponse(id, {
      resources: [
        { uri: 'owpil://site/homepage',    name: 'Homepage',    description: 'O.W.P.I.L main site', mimeType: 'text/html' },
        { uri: 'owpil://site/documentary', name: 'Documentary', description: 'Documentary promo page', mimeType: 'text/html' },
        { uri: 'owpil://site/merch',       name: 'Merch',       description: 'Merchandise store page', mimeType: 'text/html' },
        { uri: 'owpil://agent/config',     name: 'Agent Config', description: 'Sensei agent configuration', mimeType: 'application/json' },
        { uri: 'owpil://agent/skills',     name: 'Skills List', description: 'All registered agent skills', mimeType: 'application/json' },
        { uri: 'owpil://youtube/channel',  name: 'YouTube Channel', description: 'Channel stats and latest videos', mimeType: 'application/json' },
      ],
    })
  }

  // resources/read — fetch a resource
  if (method === 'resources/read') {
    const uri = params?.uri as string
    if (uri === 'owpil://agent/skills') {
      const skills = skillRegistry.getAll().map(s => ({ id: s.id, name: s.name, category: s.category, enabled: s.enabled }))
      return mcpResponse(id, {
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(skills, null, 2) }],
      })
    }
    if (uri === 'owpil://youtube/channel') {
      try {
        const ytSkill = skillRegistry.get('yt_channel_stats')
        const stats = ytSkill ? await ytSkill.execute({}) : { error: 'YouTube not configured' }
        return mcpResponse(id, {
          contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(stats, null, 2) }],
        })
      } catch (err) {
        return mcpError(id, -32000, String(err))
      }
    }
    return mcpError(id, -32602, `Unknown resource: ${uri}`)
  }

  // prompts/list — pre-built Sensei prompt templates
  if (method === 'prompts/list') {
    return mcpResponse(id, {
      prompts: [
        { name: 'daily_digest',     description: 'Generate Tyshawn\'s daily content digest from YouTube, analytics, and site stats' },
        { name: 'clip_description', description: 'Write a YouTube description and tags for a new video upload' },
        { name: 'anime_insight',    description: 'Pull an anime quote and connect it to Tyshawn\'s current journey' },
        { name: 'site_audit',       description: 'Review the O.W.P.I.L site and suggest improvements' },
      ],
    })
  }

  return mcpError(id, -32601, `Method not found: ${method}`)
}

// GET — MCP discovery endpoint (SSE for streaming clients)
export async function GET() {
  return NextResponse.json({
    name: 'owpil-mcp',
    version: '1.0.0',
    description: 'O.W.P.I.L MCP Server for Tyshawn Morehead — exposes site control, YouTube, agent skills, and more',
    protocolVersion: MCP_VERSION,
    endpoints: {
      mcp: '/api/mcp',
      youtube: '/api/youtube',
      agent: '/api/agent/chat',
      health: '/api/health',
    },
    auth: 'Bearer token via Authorization header (set MCP_SECRET env var)',
  })
}
