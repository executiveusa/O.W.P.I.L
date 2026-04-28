import type { AgentSkill, SkillExecutionContext } from '../../types'
import { z } from 'zod'

const STORYTOOLKIT_URL = process.env.STORYTOOLKIT_API_URL ?? 'http://localhost:8500'
const STORYTOOLKIT_KEY = process.env.STORYTOOLKIT_API_KEY ?? ''

async function storyCall(
  path: string,
  body?: Record<string, unknown>,
  method = 'POST'
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (STORYTOOLKIT_KEY) headers['Authorization'] = `Bearer ${STORYTOOLKIT_KEY}`

    const res = await fetch(`${STORYTOOLKIT_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const text = await res.text()
      return { success: false, error: `StoryToolkitAI error ${res.status}: ${text}` }
    }

    const data = await res.json()
    return { success: true, data }
  } catch (err) {
    return {
      success: false,
      error: `Cannot reach StoryToolkitAI at ${STORYTOOLKIT_URL}. Make sure it is running locally. ${String(err)}`,
    }
  }
}

export const storytoolkitSkills: AgentSkill[] = [
  // ── Transcription ──────────────────────────────────────────────────────────
  {
    id: 'story_transcribe',
    name: 'Transcribe Video / Audio',
    description:
      'Send a local video or audio file path to StoryToolkitAI for free automatic transcription using Whisper. Returns a job ID to track progress.',
    category: 'media',
    schema: {
      file_path: z.string().describe('Absolute path to the video or audio file on the local machine'),
      language: z.string().optional().describe('Optional language code, e.g. "en", "fr". Leave blank for auto-detect.'),
      speaker_detection: z.boolean().optional().describe('Enable automatic speaker diarisation (default false)'),
    },
    execute: async (args, _ctx?: SkillExecutionContext) => {
      return storyCall('/api/transcribe', {
        file_path: args.file_path,
        language: args.language ?? null,
        speaker_detection: args.speaker_detection ?? false,
      })
    },
  },

  // ── Transcription status ───────────────────────────────────────────────────
  {
    id: 'story_transcribe_status',
    name: 'Check Transcription Status',
    description: 'Poll the status of an ongoing transcription job by its job ID.',
    category: 'media',
    schema: {
      job_id: z.string().describe('Job ID returned by story_transcribe'),
    },
    execute: async (args, _ctx?: SkillExecutionContext) => {
      return storyCall(`/api/transcribe/status/${args.job_id}`, undefined, 'GET')
    },
  },

  // ── Semantic search ────────────────────────────────────────────────────────
  {
    id: 'story_search',
    name: 'Search Footage Semantically',
    description:
      'Search all indexed footage transcripts for a concept, theme, or phrase using sentence-transformer embeddings. Returns ranked clips with timecodes.',
    category: 'media',
    schema: {
      query: z.string().describe('Natural language search — e.g. "moment of doubt", "talking about purpose", "laughing"'),
      project: z.string().optional().describe('Restrict search to a specific project name'),
      top_k: z.number().optional().describe('Number of results to return (default 10)'),
    },
    execute: async (args, _ctx?: SkillExecutionContext) => {
      return storyCall('/api/search', {
        query: args.query,
        project: args.project ?? null,
        top_k: args.top_k ?? 10,
      })
    },
  },

  // ── Generate story / selection ─────────────────────────────────────────────
  {
    id: 'story_generate',
    name: 'Generate Story from Footage',
    description:
      'Ask the AI to automatically build a story or selection from your transcribed footage based on a theme or brief. Returns an EDL/XML cut list.',
    category: 'media',
    schema: {
      brief: z.string().describe('What story or selection you want — e.g. "3-minute arc about Tyshawn finding purpose"'),
      project: z.string().optional().describe('Restrict to a specific StoryToolkitAI project'),
      export_format: z.enum(['edl', 'xml', 'fountain', 'txt']).optional().describe('Output format (default "edl")'),
      max_duration_minutes: z.number().optional().describe('Target maximum duration in minutes'),
    },
    execute: async (args, _ctx?: SkillExecutionContext) => {
      return storyCall('/api/story/generate', {
        brief: args.brief,
        project: args.project ?? null,
        export_format: args.export_format ?? 'edl',
        max_duration_minutes: args.max_duration_minutes ?? null,
      })
    },
  },

  // ── List projects ──────────────────────────────────────────────────────────
  {
    id: 'story_list_projects',
    name: 'List StoryToolkitAI Projects',
    description: 'Return all projects currently loaded in the local StoryToolkitAI instance.',
    category: 'media',
    schema: {},
    execute: async (_args, _ctx?: SkillExecutionContext) => {
      return storyCall('/api/projects', undefined, 'GET')
    },
  },

  // ── Export transcript ──────────────────────────────────────────────────────
  {
    id: 'story_export_transcript',
    name: 'Export Transcript',
    description: 'Export a completed transcript in SRT, TXT, or AVID DS format. Returns a download path or the raw content.',
    category: 'media',
    schema: {
      transcript_id: z.string().describe('ID of the transcript to export'),
      format: z.enum(['srt', 'txt', 'avid_ds', 'fusion_text']).describe('Export format'),
    },
    execute: async (args, _ctx?: SkillExecutionContext) => {
      return storyCall('/api/transcript/export', {
        transcript_id: args.transcript_id,
        format: args.format,
      })
    },
  },

  // ── Translate transcript ───────────────────────────────────────────────────
  {
    id: 'story_translate',
    name: 'Translate Transcript',
    description: 'Translate an existing transcript to another language using OpenAI GPT.',
    category: 'media',
    schema: {
      transcript_id: z.string().describe('ID of the transcript to translate'),
      target_language: z.string().describe('Target language name or code, e.g. "Spanish", "fr"'),
    },
    execute: async (args, _ctx?: SkillExecutionContext) => {
      return storyCall('/api/transcript/translate', {
        transcript_id: args.transcript_id,
        target_language: args.target_language,
      })
    },
  },

  // ── Ask AI about footage ───────────────────────────────────────────────────
  {
    id: 'story_ask',
    name: 'Ask AI About Footage',
    description:
      'Chat with the AI about your footage context — ask questions, get summaries, request ideas. Like having a conversation with your footage.',
    category: 'media',
    schema: {
      question: z.string().describe('Your question or request about the footage'),
      project: z.string().optional().describe('Restrict context to a specific project'),
      transcript_ids: z.array(z.string()).optional().describe('Optional specific transcript IDs to include as context'),
    },
    execute: async (args, _ctx?: SkillExecutionContext) => {
      return storyCall('/api/assistant/ask', {
        question: args.question,
        project: args.project ?? null,
        transcript_ids: args.transcript_ids ?? [],
      })
    },
  },
]
