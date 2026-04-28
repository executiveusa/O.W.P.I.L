import { tool } from 'ai'
import { z } from 'zod'
import type { AgentSkill } from '../types'

// Skill Registry - Hermes-style skill management
class SkillRegistry {
  private skills: Map<string, AgentSkill> = new Map()
  
  register(skill: AgentSkill): void {
    this.skills.set(skill.id, skill)
  }
  
  get(id: string): AgentSkill | undefined {
    return this.skills.get(id)
  }
  
  getAll(): AgentSkill[] {
    return Array.from(this.skills.values())
  }
  
  getByCategory(category: AgentSkill['category']): AgentSkill[] {
    return this.getAll().filter(s => s.category === category)
  }
  
  // Convert skills to AI SDK tool format
  getToolDefinitions(): Record<string, ReturnType<typeof tool>> {
    const tools: Record<string, ReturnType<typeof tool>> = {}
    
    for (const skill of this.skills.values()) {
      tools[skill.id] = tool({
        description: skill.description,
        parameters: z.object(skill.schema as z.ZodRawShape),
        execute: async (args) => skill.execute(args),
      })
    }
    
    return tools
  }
}

export const skillRegistry = new SkillRegistry()

// Execute a skill by name
export async function executeSkill(
  skillId: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const skill = skillRegistry.get(skillId)
  if (!skill) {
    throw new Error(`Skill not found: ${skillId}`)
  }
  return skill.execute(args)
}

// Register built-in skills
import { fileSkills } from './built-in/file-skills'
import { webSkills } from './built-in/web-skills'
import { owpilSkills } from './built-in/owpil-skills'
import { browserSkills } from './built-in/browser-skills'
import { discordSkills } from './built-in/discord-skills'
import { animeSkills } from './built-in/anime-skills'
import { emailSkills } from './built-in/email-skills'
import { codemunchSkills } from './built-in/codemunch-skills'
import { graphifySkills } from './built-in/graphify-skills'
import { storytoolkitSkills } from './built-in/storytoolkit-skills'
import { youtubeSkills } from './built-in/youtube-skills'
import { composioSkills } from './built-in/composio-skills'

export function registerBuiltInSkills(): void {
  // File operations
  fileSkills.forEach(skill => skillRegistry.register(skill))
  
  // Web operations
  webSkills.forEach(skill => skillRegistry.register(skill))
  
  // O.W.P.I.L specific skills
  owpilSkills.forEach(skill => skillRegistry.register(skill))
  
  // Browser automation
  browserSkills.forEach(skill => skillRegistry.register(skill))
  
  // Discord integration
  discordSkills.forEach(skill => skillRegistry.register(skill))
  
  // Anime knowledge (Sensei specialization)
  animeSkills.forEach(skill => skillRegistry.register(skill))
  
  // Email capabilities
  emailSkills.forEach(skill => skillRegistry.register(skill))
  
  // jCodeMunch MCP - Token-efficient code exploration
  codemunchSkills.forEach(skill => skillRegistry.register(skill))
  
  // Graphify - Knowledge graph builder
  graphifySkills.forEach(skill => skillRegistry.register(skill))

  // StoryToolkitAI - Film editing, transcription, and footage intelligence
  storytoolkitSkills.forEach(skill => skillRegistry.register(skill))

  // YouTube — channel management, analytics, video control
  youtubeSkills.forEach(skill => skillRegistry.register(skill))

  // Composio — 500+ managed integrations (Gmail, GitHub, Slack, Notion, Salesforce, HubSpot, etc.)
  composioSkills.forEach(skill => skillRegistry.register(skill))
}

// Auto-register on import
registerBuiltInSkills()
