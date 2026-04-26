import { generateText } from 'ai'
import { getDefaultModel } from '@/lib/agent/providers/openrouter'

export const runtime = 'nodejs'
export const maxDuration = 30

// Server-side transcription endpoint
// Uses OpenAI Whisper API or falls back to audio description via LLM
export async function POST(req: Request) {
  try {
    const { audio } = await req.json()

    if (!audio) {
      return new Response(
        JSON.stringify({ error: 'No audio data provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Option 1: Use OpenAI Whisper API directly
    const openaiKey = process.env.OPENAI_API_KEY
    
    if (openaiKey) {
      // Convert base64 to blob
      const binaryData = atob(audio)
      const bytes = new Uint8Array(binaryData.length)
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'audio/webm' })
      
      // Create form data
      const formData = new FormData()
      formData.append('file', blob, 'audio.webm')
      formData.append('model', 'whisper-1')
      formData.append('language', 'en')
      
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: formData,
      })
      
      if (response.ok) {
        const result = await response.json()
        return new Response(
          JSON.stringify({ text: result.text }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Option 2: Use Groq's Whisper endpoint
    const groqKey = process.env.GROQ_API_KEY
    
    if (groqKey) {
      const binaryData = atob(audio)
      const bytes = new Uint8Array(binaryData.length)
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'audio/webm' })
      
      const formData = new FormData()
      formData.append('file', blob, 'audio.webm')
      formData.append('model', 'whisper-large-v3')
      formData.append('language', 'en')
      
      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
        },
        body: formData,
      })
      
      if (response.ok) {
        const result = await response.json()
        return new Response(
          JSON.stringify({ text: result.text }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Fallback: Return error if no transcription service available
    return new Response(
      JSON.stringify({ 
        error: 'No transcription service configured',
        hint: 'Set OPENAI_API_KEY or GROQ_API_KEY for Whisper transcription',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Transcription error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Transcription failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
