import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_CRON_JOBS, executeCronJob, getNextRunTime, formatSchedule } from '@/lib/agent/cron/scheduler'

// This endpoint is called by Vercel Cron
// Configure in vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "0 * * * *" }] }

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results: { jobId: string; success: boolean; result?: unknown; error?: string }[] = []
  
  for (const job of DEFAULT_CRON_JOBS) {
    if (!job.enabled) continue
    
    // Check if job should run now
    const nextRun = getNextRunTime(job.schedule, new Date(now.getTime() - 60000)) // Check last minute
    const shouldRun = nextRun <= now
    
    if (shouldRun) {
      const { success, result, error } = await executeCronJob(job)
      results.push({ jobId: job.id, success, result, error })
      
      // If email is configured and job produced content, send email
      if (success && result && process.env.AGENT_EMAIL_ADDRESS) {
        await sendJobResultEmail(job, result)
      }
    }
  }

  return NextResponse.json({ 
    executed: results.length,
    results,
    timestamp: now.toISOString(),
  })
}

// POST - Manually trigger a cron job
export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json()
    
    const job = DEFAULT_CRON_JOBS.find(j => j.id === jobId)
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    
    const { success, result, error } = await executeCronJob(job)
    
    return NextResponse.json({ success, result, error })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to execute job' }, { status: 500 })
  }
}

// Send email with job results using Resend
async function sendJobResultEmail(job: typeof DEFAULT_CRON_JOBS[0], result: unknown) {
  const resendApiKey = process.env.RESEND_API_KEY
  const agentEmail = process.env.AGENT_EMAIL_ADDRESS
  const ownerEmail = process.env.OWNER_EMAIL_ADDRESS
  
  if (!resendApiKey || !agentEmail || !ownerEmail) return
  
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: agentEmail,
        to: ownerEmail,
        subject: `[Sensei] ${job.name}`,
        html: formatEmailContent(job, result),
      }),
    })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

function formatEmailContent(job: typeof DEFAULT_CRON_JOBS[0], result: unknown): string {
  const resultStr = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
  
  return `
    <div style="font-family: 'Space Mono', monospace; background: #0a0a0a; color: #e8e8e8; padding: 40px; border-radius: 8px;">
      <h1 style="color: #c4a265; font-family: 'Playfair Display', serif; margin-bottom: 24px;">
        O.W.P.I.L - Sensei
      </h1>
      <h2 style="color: #e8e8e8; margin-bottom: 16px;">${job.name}</h2>
      <p style="color: #888; margin-bottom: 24px;">${job.description}</p>
      <div style="background: #1a1a1a; padding: 24px; border-radius: 8px; border-left: 4px solid #c4a265;">
        <pre style="white-space: pre-wrap; word-wrap: break-word; margin: 0; font-size: 14px;">${resultStr}</pre>
      </div>
      <p style="color: #666; margin-top: 24px; font-size: 12px;">
        Schedule: ${formatSchedule(job.schedule)} | Sent by your AI assistant, Sensei
      </p>
    </div>
  `
}
