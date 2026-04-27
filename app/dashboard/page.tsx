'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { Send, Mic, MicOff, Loader2, Bot, User, Sparkles } from 'lucide-react'

export default function DashboardChatPage() {
  const [sessionId] = useState(() => 
    typeof window !== 'undefined' 
      ? localStorage.getItem('owpil-session') || crypto.randomUUID()
      : crypto.randomUUID()
  )
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/agent/chat',
    body: { sessionId },
  })
  
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Save session ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('owpil-session', sessionId)
    }
  }, [sessionId])
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const toggleListening = () => {
    setIsListening(!isListening)
    // Voice input will be implemented in Phase 5
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="font-serif text-lg text-foreground">O.W.P.I.L Assistant</h1>
            <p className="text-xs text-muted-foreground font-mono">
              {isLoading ? 'Thinking...' : 'Ready to help'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            Session: {sessionId.slice(0, 8)}
          </span>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <h2 className="font-serif text-2xl text-foreground mb-2">Welcome to O.W.P.I.L</h2>
            <p className="text-muted-foreground font-mono text-sm max-w-md">
              I can help you edit your website, search for artists, browse the web, 
              and execute complex tasks autonomously.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              {[
                'Update the hero images',
                'Find indie music artists',
                'Add a new timeline entry',
                'Search for design inspiration',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    const fakeEvent = { target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>
                    handleInputChange(fakeEvent)
                  }}
                  className="px-4 py-3 rounded-lg border border-border bg-card/50 text-left text-sm font-mono text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent" />
              </div>
            )}
            
            <div className={`
              max-w-[80%] rounded-2xl px-4 py-3
              ${message.role === 'user' 
                ? 'bg-accent text-background' 
                : 'bg-card border border-border'
              }
            `}>
              <div className={`
                font-mono text-sm whitespace-pre-wrap
                ${message.role === 'user' ? 'text-background' : 'text-foreground'}
              `}>
                {message.content}
              </div>
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                <User className="w-4 h-4 text-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive font-mono">
            Error: {error.message}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="border-t border-border p-4 bg-card/50">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={toggleListening}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-colors
              ${isListening 
                ? 'bg-accent text-background' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="flex-1 bg-muted border border-border rounded-full px-5 py-3 text-foreground font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
          />
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  )
}
