"use client"

import { useState, useEffect, useRef } from "react"
import { 
  User, Upload, Sparkles, Clock, Mail, Settings, 
  Play, Pause, RefreshCw, Check, X, Volume2, Heart
} from "lucide-react"

interface AgentConfig {
  name: string
  personality: string
  avatarUrl: string
  voiceEnabled: boolean
  emailAddress: string
  cronEnabled: boolean
  activeWorkflows: string[]
}

interface Avatar {
  url: string
  pathname: string
  type: string
}

interface CronJob {
  id: string
  name: string
  description: string
  schedule: string
  enabled: boolean
}

const defaultJobs: CronJob[] = [
  { id: 'daily-inspiration', name: 'Daily Anime Inspiration', description: 'Send an anime quote every morning', schedule: '8:00 AM Daily', enabled: true },
  { id: 'weekly-recommendations', name: 'Weekly Recommendations', description: 'Personalized anime picks every Sunday', schedule: '10:00 AM Sundays', enabled: true },
  { id: 'website-backup', name: 'Website Backup', description: 'Backup content automatically', schedule: '2:00 AM Daily', enabled: false },
]

export default function AgentSettingsPage() {
  const [config, setConfig] = useState<AgentConfig>({
    name: 'Sensei',
    personality: 'anime-expert',
    avatarUrl: '',
    voiceEnabled: true,
    emailAddress: '',
    cronEnabled: false,
    activeWorkflows: [],
  })
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [jobs, setJobs] = useState<CronJob[]>(defaultJobs)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConfig()
    loadAvatars()
  }, [])

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/agent/config')
      const data = await res.json()
      if (data.config) setConfig(data.config)
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const loadAvatars = async () => {
    try {
      const res = await fetch('/api/agent/avatar')
      const data = await res.json()
      if (data.avatars) setAvatars(data.avatars)
    } catch (error) {
      console.error('Failed to load avatars:', error)
    }
  }

  const saveConfig = async () => {
    setLoading(true)
    try {
      await fetch('/api/agent/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save config:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'custom')

    try {
      const res = await fetch('/api/agent/avatar', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setConfig(prev => ({ ...prev, avatarUrl: data.url }))
        loadAvatars()
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
    } finally {
      setUploading(false)
    }
  }

  const toggleJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, enabled: !job.enabled } : job
    ))
  }

  const runJobNow = async (jobId: string) => {
    try {
      const res = await fetch('/api/cron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      })
      const data = await res.json()
      if (data.success) {
        alert('Job completed successfully!')
      }
    } catch (error) {
      console.error('Failed to run job:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Agent Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Customize your AI assistant</p>
        </div>
        <button
          onClick={saveConfig}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg font-mono text-sm transition-all hover:bg-accent/80 disabled:opacity-50"
        >
          {saved ? <Check className="w-4 h-4" /> : loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
          {saved ? 'Saved!' : loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Identity Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-5 h-5 text-accent" />
          <h2 className="font-serif text-lg">Identity & Personality</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Avatar Section */}
          <div className="space-y-4">
            <label className="block text-sm text-muted-foreground">Agent Avatar</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-muted border-2 border-accent/50 overflow-hidden flex items-center justify-center flex-shrink-0">
                {config.avatarUrl ? (
                  <img src={config.avatarUrl} alt="Agent avatar" className="w-full h-full object-cover object-center" loading="lazy" />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload New'}
                </button>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </div>
            
            {/* Saved Avatars */}
            {avatars.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs text-muted-foreground">Saved Avatars</label>
                <div className="flex gap-2 flex-wrap">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.pathname}
                      onClick={() => setConfig(prev => ({ ...prev, avatarUrl: avatar.url }))}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all flex-shrink-0 ${
                        config.avatarUrl === avatar.url ? 'border-accent scale-110' : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <img src={avatar.url} alt="Avatar option" className="w-full h-full object-cover object-center" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Name & Personality */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Agent Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-mono focus:outline-none focus:border-accent"
                placeholder="Sensei"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Personality</label>
              <select
                value={config.personality}
                onChange={(e) => setConfig(prev => ({ ...prev, personality: e.target.value }))}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-mono focus:outline-none focus:border-accent"
              >
                <option value="anime-expert">Anime Expert (Default)</option>
                <option value="mentor">Wise Mentor</option>
                <option value="friend">Friendly Assistant</option>
                <option value="professional">Professional</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConfig(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  config.voiceEnabled ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                Voice {config.voiceEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-accent" />
          <h2 className="font-serif text-lg">Email Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Your Email (for notifications)</label>
            <input
              type="email"
              value={config.emailAddress}
              onChange={(e) => setConfig(prev => ({ ...prev, emailAddress: e.target.value }))}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg font-mono focus:outline-none focus:border-accent"
              placeholder="your@email.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Sensei will send you daily inspirations and updates here
            </p>
          </div>
        </div>
      </div>

      {/* Scheduled Tasks (Cron Jobs) */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-accent" />
            <h2 className="font-serif text-lg">Scheduled Tasks</h2>
          </div>
          <button
            onClick={() => setConfig(prev => ({ ...prev, cronEnabled: !prev.cronEnabled }))}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              config.cronEnabled ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'
            }`}
          >
            {config.cronEnabled ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {config.cronEnabled ? 'Active' : 'Paused'}
          </button>
        </div>
        
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                job.enabled ? 'bg-muted/50 border-border' : 'bg-background border-border/50 opacity-60'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-sm">{job.name}</h3>
                  <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">{job.schedule}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{job.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => runJobNow(job.id)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Run now"
                >
                  <Play className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleJob(job.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    job.enabled ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {job.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="font-serif text-lg">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="text-xs font-mono">Get Inspiration</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <RefreshCw className="w-6 h-6 text-accent" />
            <span className="text-xs font-mono">Recommend Anime</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <Mail className="w-6 h-6 text-accent" />
            <span className="text-xs font-mono">Send Digest</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <Heart className="w-6 h-6 text-accent" />
            <span className="text-xs font-mono">View Soul Files</span>
          </button>
        </div>
      </div>
    </div>
  )
}
