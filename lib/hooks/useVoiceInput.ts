'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseVoiceInputOptions {
  onTranscript?: (text: string) => void
  onError?: (error: Error) => void
  continuous?: boolean
  language?: string
}

interface UseVoiceInputReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
  error: Error | null
}

// Use Web Speech API for voice recognition
// In production, can be enhanced with browser-whisper for local processing
export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const {
    onTranscript,
    onError,
    continuous = false,
    language = 'en-US',
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = 
      (window as typeof window & { SpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as typeof window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition

    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = continuous
      recognition.interimResults = true
      recognition.lang = language

      recognition.onresult = (event) => {
        const results = Array.from(event.results)
        const transcript = results
          .map((result) => result[0].transcript)
          .join('')

        setTranscript(transcript)

        // Call callback for final results
        const lastResult = results[results.length - 1]
        if (lastResult?.isFinal) {
          onTranscript?.(transcript)
        }
      }

      recognition.onerror = (event) => {
        const err = new Error(`Speech recognition error: ${event.error}`)
        setError(err)
        onError?.(err)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [continuous, language, onTranscript, onError])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      const err = new Error('Speech recognition not supported')
      setError(err)
      onError?.(err)
      return
    }

    setError(null)
    setTranscript('')
    
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (e) {
      // May already be started
      if (e instanceof Error && e.message.includes('already started')) {
        setIsListening(true)
      } else {
        const err = e instanceof Error ? e : new Error('Failed to start recognition')
        setError(err)
        onError?.(err)
      }
    }
  }, [onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    error,
  }
}

// Whisper-based transcription for more accurate results
// Requires @xenova/transformers for client-side Whisper
export async function transcribeWithWhisper(audioBlob: Blob): Promise<string> {
  // Convert blob to base64
  const buffer = await audioBlob.arrayBuffer()
  const base64 = btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )

  // Send to API for transcription
  const response = await fetch('/api/voice/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio: base64 }),
  })

  if (!response.ok) {
    throw new Error('Transcription failed')
  }

  const { text } = await response.json()
  return text
}
