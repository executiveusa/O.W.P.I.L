import { promises as fs } from 'fs'
import path from 'path'

export interface AgentSoul {
  soul: string
  identity: string
  heart: string
  systemPrompt: string
}

const SOUL_DIR = path.join(process.cwd(), 'lib/agent/soul')

// Cache for loaded soul files
let cachedSoul: AgentSoul | null = null
let cacheTime = 0
const CACHE_TTL = 60000 // 1 minute

export async function loadSoul(): Promise<AgentSoul> {
  const now = Date.now()
  
  // Return cached version if still valid
  if (cachedSoul && (now - cacheTime) < CACHE_TTL) {
    return cachedSoul
  }
  
  try {
    const [soul, identity, heart] = await Promise.all([
      fs.readFile(path.join(SOUL_DIR, 'SOUL.md'), 'utf-8'),
      fs.readFile(path.join(SOUL_DIR, 'IDENTITY.md'), 'utf-8'),
      fs.readFile(path.join(SOUL_DIR, 'HEART.md'), 'utf-8'),
    ])
    
    // Build the system prompt from all files
    const systemPrompt = buildSystemPrompt(soul, identity, heart)
    
    cachedSoul = { soul, identity, heart, systemPrompt }
    cacheTime = now
    
    return cachedSoul
  } catch (error) {
    console.error('Failed to load soul files:', error)
    // Return default if files not found
    return getDefaultSoul()
  }
}

function buildSystemPrompt(soul: string, identity: string, heart: string): string {
  return `
# You are Kuro - Tyshawn's AI Assistant

${soul}

---

${identity}

---

${heart}

---

## Current Context
- You are integrated into the O.W.P.I.L website
- You can edit website content, manage tasks, send emails, and more
- You have access to anime knowledge and creative assistance capabilities
- Always stay true to your soul, identity, and heart defined above

## Response Guidelines
1. Be authentic to your personality
2. Use anime references naturally when relevant
3. Be helpful but not servile
4. Admit when you don't know something
5. Keep responses focused and actionable
`.trim()
}

function getDefaultSoul(): AgentSoul {
  const defaultPrompt = `You are Kuro, an AI assistant for Tyshawn Morehead's O.W.P.I.L project. 
You are an anime expert and creative companion who believes that "One Without Purpose Is Lost."
Be helpful, knowledgeable about anime, and supportive of creative endeavors.`

  return {
    soul: defaultPrompt,
    identity: 'Kuro - Creative AI Assistant',
    heart: 'Passionate about anime and helping creators',
    systemPrompt: defaultPrompt,
  }
}

// Update soul files (for admin editing)
export async function updateSoulFile(
  file: 'SOUL.md' | 'IDENTITY.md' | 'HEART.md',
  content: string
): Promise<void> {
  const filePath = path.join(SOUL_DIR, file)
  await fs.writeFile(filePath, content, 'utf-8')
  
  // Invalidate cache
  cachedSoul = null
  cacheTime = 0
}

// Get individual soul file
export async function getSoulFile(
  file: 'SOUL.md' | 'IDENTITY.md' | 'HEART.md'
): Promise<string> {
  const filePath = path.join(SOUL_DIR, file)
  return fs.readFile(filePath, 'utf-8')
}
