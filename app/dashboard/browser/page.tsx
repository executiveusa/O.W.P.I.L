'use client'

import { useState } from 'react'
import { 
  Globe, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight,
  MousePointer,
  Type,
  Camera,
  Play,
  Square,
  Monitor,
  Loader2
} from 'lucide-react'

export default function BrowserPage() {
  const [url, setUrl] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([
    'Browser control ready',
    'Waiting for commands...',
  ])
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }
  
  const handleNavigate = async () => {
    if (!url) return
    
    setIsRunning(true)
    addLog(`Navigating to: ${url}`)
    setCurrentAction('navigate')
    
    // Simulate navigation - in production this calls the browser API
    await new Promise(r => setTimeout(r, 2000))
    
    addLog('Page loaded successfully')
    setCurrentAction(null)
    setIsRunning(false)
  }
  
  const handleAction = async (action: string) => {
    setIsRunning(true)
    setCurrentAction(action)
    addLog(`Executing: ${action}`)
    
    await new Promise(r => setTimeout(r, 1500))
    
    if (action === 'screenshot') {
      addLog('Screenshot captured')
      // In production, this would add actual screenshot
    } else {
      addLog(`${action} completed`)
    }
    
    setCurrentAction(null)
    setIsRunning(false)
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="font-serif text-lg text-foreground">Browser Control</h1>
            <p className="text-xs text-muted-foreground font-mono">
              {isRunning ? 'Running...' : 'Idle'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-colors
              ${isRunning 
                ? 'bg-destructive text-destructive-foreground' 
                : 'bg-accent text-background'
              }
            `}
          >
            {isRunning ? (
              <>
                <Square size={16} />
                Stop Session
              </>
            ) : (
              <>
                <Play size={16} />
                Start Session
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Browser View */}
        <div className="flex-1 flex flex-col border-r border-border">
          {/* URL Bar */}
          <div className="p-3 border-b border-border bg-card/50">
            <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => handleAction('back')}
              >
                <ArrowLeft size={16} />
              </button>
              <button 
                className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => handleAction('forward')}
              >
                <ArrowRight size={16} />
              </button>
              <button 
                className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => handleAction('refresh')}
              >
                <RefreshCw size={16} className={isRunning ? 'animate-spin' : ''} />
              </button>
              
              <div className="flex-1 flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2">
                <Globe size={14} className="text-muted-foreground" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
                  placeholder="Enter URL to navigate..."
                  className="flex-1 bg-transparent text-foreground font-mono text-sm focus:outline-none placeholder:text-muted-foreground"
                />
              </div>
              
              <button
                onClick={handleNavigate}
                disabled={!url || isRunning}
                className="px-4 py-2 rounded-lg bg-accent text-background font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Go
              </button>
            </div>
          </div>
          
          {/* Browser Viewport */}
          <div className="flex-1 bg-muted/50 flex items-center justify-center relative">
            {isRunning && currentAction && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
                  <p className="font-mono text-sm text-foreground">
                    Executing: {currentAction}
                  </p>
                </div>
              </div>
            )}
            
            <div className="text-center p-8">
              <div className="w-24 h-24 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-6">
                <Globe className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                Browser Preview
              </h3>
              <p className="text-sm text-muted-foreground font-mono max-w-sm">
                Enter a URL and start a session to control a browser instance. 
                Screenshots will appear here as you navigate.
              </p>
            </div>
          </div>
          
          {/* Action Toolbar */}
          <div className="p-3 border-t border-border bg-card/50">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono mr-2">Actions:</span>
              
              <button
                onClick={() => handleAction('click')}
                disabled={!isRunning}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 font-mono text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MousePointer size={14} />
                Click
              </button>
              
              <button
                onClick={() => handleAction('type')}
                disabled={!isRunning}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 font-mono text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Type size={14} />
                Type
              </button>
              
              <button
                onClick={() => handleAction('screenshot')}
                disabled={!isRunning}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 font-mono text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera size={14} />
                Screenshot
              </button>
            </div>
          </div>
        </div>
        
        {/* Logs Panel */}
        <div className="w-80 flex flex-col bg-card/50">
          <div className="p-3 border-b border-border">
            <h3 className="font-mono text-sm text-foreground">Activity Log</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className="text-xs font-mono text-muted-foreground">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
