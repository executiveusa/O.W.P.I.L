import { animeSkills } from '../skills/built-in/anime-skills'

// Cron job definitions
export interface CronJob {
  id: string
  name: string
  description: string
  schedule: string // Cron expression
  skillId: string
  skillArgs: Record<string, unknown>
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
}

// Default cron jobs for the agent
export const DEFAULT_CRON_JOBS: CronJob[] = [
  {
    id: 'daily-inspiration',
    name: 'Daily Anime Inspiration',
    description: 'Send a daily anime quote and affirmation',
    schedule: '0 8 * * *', // 8 AM daily
    skillId: 'daily_anime_inspiration',
    skillArgs: {},
    enabled: true,
  },
  {
    id: 'weekly-recommendations',
    name: 'Weekly Anime Recommendations',
    description: 'Send personalized anime recommendations every Sunday',
    schedule: '0 10 * * 0', // 10 AM Sundays
    skillId: 'anime_recommend',
    skillArgs: { genre: 'philosophical', count: 3 },
    enabled: true,
  },
  {
    id: 'website-backup',
    name: 'Website Content Backup',
    description: 'Backup website content data daily',
    schedule: '0 2 * * *', // 2 AM daily
    skillId: 'backup_content',
    skillArgs: {},
    enabled: false,
  },
]

// Parse cron expression to get next run time
export function getNextRunTime(schedule: string, from: Date = new Date()): Date {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = schedule.split(' ')
  
  const next = new Date(from)
  next.setSeconds(0)
  next.setMilliseconds(0)
  
  // Simple implementation for common patterns
  if (minute !== '*') next.setMinutes(parseInt(minute))
  if (hour !== '*') next.setHours(parseInt(hour))
  
  // Move to next day if time has passed
  if (next <= from) {
    next.setDate(next.getDate() + 1)
  }
  
  // Handle day of week (0 = Sunday)
  if (dayOfWeek !== '*') {
    const targetDay = parseInt(dayOfWeek)
    while (next.getDay() !== targetDay) {
      next.setDate(next.getDate() + 1)
    }
  }
  
  return next
}

// Execute a cron job
export async function executeCronJob(job: CronJob): Promise<{ success: boolean; result: unknown; error?: string }> {
  try {
    const skill = animeSkills.find(s => s.id === job.skillId)
    
    if (!skill) {
      return { success: false, result: null, error: `Skill ${job.skillId} not found` }
    }
    
    const result = await skill.execute(job.skillArgs)
    return { success: true, result }
  } catch (error) {
    return { 
      success: false, 
      result: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Format schedule for human reading
export function formatSchedule(schedule: string): string {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = schedule.split(' ')
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  let description = ''
  
  if (dayOfWeek !== '*') {
    description += `Every ${days[parseInt(dayOfWeek)]} `
  } else if (dayOfMonth !== '*') {
    description += `On day ${dayOfMonth} of each month `
  } else {
    description += 'Daily '
  }
  
  if (hour !== '*') {
    const h = parseInt(hour)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    description += `at ${h12}:${minute.padStart(2, '0')} ${ampm}`
  }
  
  return description.trim()
}
