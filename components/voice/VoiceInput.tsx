'use client'

import { useVoiceInput } from '@/lib/hooks/useVoiceInput'
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showTranscript?: boolean
}

export function VoiceInput({
  onTranscript,
  className = '',
  size = 'md',
  showTranscript = false,
}: VoiceInputProps) {
  const [finalTranscript, setFinalTranscript] = useState('')
  
  const {
    isListening,
    isSupported,
    transcript,
    toggleListening,
    error,
  } = useVoiceInput({
    onTranscript: (text) => {
      setFinalTranscript(text)
      onTranscript(text)
    },
    continuous: false,
  })

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  if (!isSupported) {
    return (
      <button
        disabled
        className={`
          ${sizeClasses[size]} rounded-full flex items-center justify-center
          bg-muted text-muted-foreground cursor-not-allowed
          ${className}
        `}
        title="Voice input not supported in this browser"
      >
        <MicOff size={iconSizes[size]} />
      </button>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        className={`
          ${sizeClasses[size]} rounded-full flex items-center justify-center
          transition-all duration-200
          ${isListening 
            ? 'bg-accent text-background animate-pulse ring-4 ring-accent/30' 
            : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
          }
          ${error ? 'ring-2 ring-destructive' : ''}
        `}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <Mic size={iconSizes[size]} className="animate-pulse" />
        ) : error ? (
          <AlertCircle size={iconSizes[size]} className="text-destructive" />
        ) : (
          <Mic size={iconSizes[size]} />
        )}
      </button>

      {showTranscript && (isListening || transcript) && (
        <div className="text-center max-w-xs">
          {isListening && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Loader2 size={12} className="animate-spin" />
              Listening...
            </div>
          )}
          {transcript && (
            <p className="text-sm text-foreground font-mono mt-1 italic">
              &ldquo;{transcript}&rdquo;
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive font-mono mt-1">
          {error.message}
        </p>
      )}
    </div>
  )
}

// Floating voice button for global access
export function FloatingVoiceButton({
  onTranscript,
}: {
  onTranscript: (text: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [lastTranscript, setLastTranscript] = useState('')

  const handleTranscript = (text: string) => {
    setLastTranscript(text)
    onTranscript(text)
    // Auto-close after receiving transcript
    setTimeout(() => setIsOpen(false), 1500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
          <VoiceInput
            onTranscript={handleTranscript}
            size="lg"
            showTranscript
          />
          <button
            onClick={() => setIsOpen(false)}
            className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground font-mono"
          >
            Close
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-accent text-background flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors"
        >
          <Mic size={24} />
        </button>
      )}
    </div>
  )
}
