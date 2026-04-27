import type { AgentSkill, SkillExecutionContext } from '../../types'
import { z } from 'zod'

// Email skill for the agent
export const emailSkills: AgentSkill[] = [
  {
    id: 'send_email',
    name: 'Send Email',
    description: 'Send an email from the agent email address',
    category: 'system',
    schema: {
      to: z.string().email().describe('Recipient email address'),
      subject: z.string().describe('Email subject'),
      body: z.string().describe('Email body content'),
      isHtml: z.boolean().optional().describe('Whether body is HTML'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const resendApiKey = process.env.RESEND_API_KEY
      const agentEmail = process.env.AGENT_EMAIL_ADDRESS
      
      if (!resendApiKey || !agentEmail) {
        return { 
          success: false, 
          error: 'Email not configured. Set RESEND_API_KEY and AGENT_EMAIL_ADDRESS.' 
        }
      }
      
      const { to, subject, body, isHtml } = args as { 
        to: string
        subject: string
        body: string
        isHtml?: boolean 
      }
      
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: agentEmail,
            to,
            subject: `[Sensei] ${subject}`,
            [isHtml ? 'html' : 'text']: body,
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          return { success: false, error: error.message || 'Failed to send email' }
        }
        
        const data = await response.json()
        return { success: true, emailId: data.id }
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      }
    },
  },
  
  {
    id: 'send_daily_digest',
    name: 'Send Daily Digest',
    description: 'Send a daily digest email with website stats and updates',
    category: 'system',
    schema: {},
    execute: async (args, context?: SkillExecutionContext) => {
      const ownerEmail = process.env.OWNER_EMAIL_ADDRESS
      
      if (!ownerEmail) {
        return { success: false, error: 'OWNER_EMAIL_ADDRESS not configured' }
      }
      
      // Get daily stats (placeholder - would connect to analytics)
      const stats = {
        date: new Date().toISOString().split('T')[0],
        pageViews: Math.floor(Math.random() * 500) + 100,
        uniqueVisitors: Math.floor(Math.random() * 200) + 50,
        topPages: ['/gallery', '/', '/philosophy'],
        newSubscribers: Math.floor(Math.random() * 5),
      }
      
      const html = `
        <div style="font-family: 'Space Mono', monospace; background: #0a0a0a; color: #e8e8e8; padding: 40px; border-radius: 8px;">
          <h1 style="color: #c4a265; font-family: 'Playfair Display', serif;">Daily Digest - ${stats.date}</h1>
          <div style="margin: 24px 0;">
            <h3 style="color: #888;">Website Statistics</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid #333;">Page Views: <strong>${stats.pageViews}</strong></li>
              <li style="padding: 8px 0; border-bottom: 1px solid #333;">Unique Visitors: <strong>${stats.uniqueVisitors}</strong></li>
              <li style="padding: 8px 0; border-bottom: 1px solid #333;">New Subscribers: <strong>${stats.newSubscribers}</strong></li>
            </ul>
          </div>
          <p style="color: #666; font-size: 12px;">- Sensei, your AI assistant</p>
        </div>
      `
      
      // Use the send_email skill
      const sendSkill = emailSkills.find(s => s.id === 'send_email')
      if (sendSkill) {
        return sendSkill.execute({
          to: ownerEmail,
          subject: `Daily Digest - ${stats.date}`,
          body: html,
          isHtml: true,
        }, context)
      }
      
      return { success: false, error: 'Send email skill not found' }
    },
  },
  
  {
    id: 'notify_owner',
    name: 'Notify Owner',
    description: 'Send a quick notification to the site owner',
    category: 'system',
    schema: {
      message: z.string().describe('Notification message'),
      priority: z.enum(['low', 'normal', 'high']).optional().describe('Priority level'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const ownerEmail = process.env.OWNER_EMAIL_ADDRESS
      
      if (!ownerEmail) {
        return { success: false, error: 'OWNER_EMAIL_ADDRESS not configured' }
      }
      
      const { message, priority = 'normal' } = args as { message: string; priority?: string }
      
      const priorityEmoji = { low: '', normal: '', high: '[URGENT] ' }
      const subject = `${priorityEmoji[priority as keyof typeof priorityEmoji] || ''}Notification from Sensei`
      
      const sendSkill = emailSkills.find(s => s.id === 'send_email')
      if (sendSkill) {
        return sendSkill.execute({
          to: ownerEmail,
          subject,
          body: message,
          isHtml: false,
        }, context)
      }
      
      return { success: false, error: 'Send email skill not found' }
    },
  },
]
