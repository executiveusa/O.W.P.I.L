import type { AgentSkill } from '../../types'
import { z } from 'zod'
import { DiscordClient } from '../../discord/client'

export const discordSkills: AgentSkill[] = [
  {
    id: 'discord_send_message',
    name: 'Send Discord Message',
    description: 'Send a message to a Discord channel',
    category: 'discord',
    schema: {
      channelId: z.string().describe('The Discord channel ID'),
      content: z.string().describe('Message content'),
      title: z.string().optional().describe('Optional embed title'),
      color: z.enum(['gold', 'green', 'red', 'blue']).optional().describe('Embed color'),
    },
    execute: async (args) => {
      const channelId = args.channelId as string
      const content = args.content as string
      const title = args.title as string | undefined
      const color = args.color as 'gold' | 'green' | 'red' | 'blue' | undefined
      
      try {
        const discord = new DiscordClient()
        
        const message = title 
          ? {
              content: '',
              embeds: [DiscordClient.buildEmbed({
                title,
                description: content,
                color: color || 'gold',
              })],
            }
          : { content }
        
        await discord.sendMessage(channelId, message)
        
        return { success: true, message: 'Message sent to Discord' }
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to send Discord message' 
        }
      }
    },
  },
  
  {
    id: 'discord_notify',
    name: 'Send Notification',
    description: 'Send a notification to the configured notification channel',
    category: 'discord',
    schema: {
      title: z.string().describe('Notification title'),
      message: z.string().describe('Notification message'),
      type: z.enum(['info', 'success', 'warning', 'error']).describe('Notification type'),
    },
    execute: async (args) => {
      const title = args.title as string
      const message = args.message as string
      const type = args.type as 'info' | 'success' | 'warning' | 'error'
      
      const notificationChannel = process.env.DISCORD_NOTIFICATION_CHANNEL
      
      if (!notificationChannel) {
        return { success: false, error: 'Notification channel not configured' }
      }
      
      try {
        const discord = new DiscordClient()
        
        const colorMap = {
          info: 'blue' as const,
          success: 'green' as const,
          warning: 'gold' as const,
          error: 'red' as const,
        }
        
        await discord.sendMessage(notificationChannel, {
          content: '',
          embeds: [DiscordClient.buildEmbed({
            title,
            description: message,
            color: colorMap[type],
          })],
        })
        
        return { success: true, message: 'Notification sent' }
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to send notification' 
        }
      }
    },
  },
]
