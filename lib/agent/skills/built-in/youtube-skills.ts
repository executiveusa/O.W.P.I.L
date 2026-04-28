import type { AgentSkill } from '../../types'

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3'
const YT_API_KEY  = () => process.env.YOUTUBE_API_KEY ?? ''
const YT_CHANNEL_ID = () => process.env.YOUTUBE_CHANNEL_ID ?? ''
const YT_ACCESS_TOKEN = () => process.env.YOUTUBE_ACCESS_TOKEN ?? ''

async function ytGet(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${YT_API_BASE}/${endpoint}`)
  url.searchParams.set('key', YT_API_KEY())
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`YouTube API error ${res.status}: ${await res.text()}`)
  return res.json()
}

async function ytPost(endpoint: string, body: unknown) {
  const res = await fetch(`${YT_API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YT_ACCESS_TOKEN()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`YouTube API error ${res.status}: ${await res.text()}`)
  return res.json()
}

export const youtubeSkills: AgentSkill[] = [
  {
    id: 'yt_channel_stats',
    name: 'Get Channel Stats',
    description: 'Get subscriber count, total views, video count and latest stats for the OWPIL YouTube channel.',
    category: 'owpil',
    enabled: true,
    schema: {},
    execute: async () => {
      const data = await ytGet('channels', {
        part: 'snippet,statistics,brandingSettings',
        id: YT_CHANNEL_ID(),
      })
      const ch = data.items?.[0]
      if (!ch) return { error: 'Channel not found — check YOUTUBE_CHANNEL_ID env var' }
      return {
        name: ch.snippet.title,
        description: ch.snippet.description,
        subscribers: ch.statistics.subscriberCount,
        totalViews: ch.statistics.viewCount,
        videoCount: ch.statistics.videoCount,
        thumbnail: ch.snippet.thumbnails?.high?.url,
        customUrl: ch.snippet.customUrl,
        publishedAt: ch.snippet.publishedAt,
      }
    },
  },

  {
    id: 'yt_latest_videos',
    name: 'Get Latest Videos',
    description: 'Fetch the most recent videos from the OWPIL YouTube channel.',
    category: 'owpil',
    enabled: true,
    schema: {
      maxResults: { type: 'number', description: 'Number of videos to return (1-50)', default: 10 },
    },
    execute: async ({ maxResults = 10 }: { maxResults?: number }) => {
      const search = await ytGet('search', {
        part: 'snippet',
        channelId: YT_CHANNEL_ID(),
        type: 'video',
        order: 'date',
        maxResults: String(maxResults),
      })
      const ids = search.items.map((i: { id: { videoId: string } }) => i.id.videoId).join(',')
      const details = await ytGet('videos', {
        part: 'snippet,statistics,contentDetails',
        id: ids,
      })
      return details.items.map((v: {
        id: string
        snippet: { title: string; description: string; publishedAt: string; thumbnails: { high: { url: string } } }
        statistics: { viewCount: string; likeCount: string; commentCount: string }
        contentDetails: { duration: string }
      }) => ({
        id: v.id,
        title: v.snippet.title,
        description: v.snippet.description?.slice(0, 200),
        publishedAt: v.snippet.publishedAt,
        thumbnail: v.snippet.thumbnails?.high?.url,
        views: v.statistics.viewCount,
        likes: v.statistics.likeCount,
        comments: v.statistics.commentCount,
        duration: v.contentDetails.duration,
        url: `https://youtube.com/watch?v=${v.id}`,
      }))
    },
  },

  {
    id: 'yt_video_analytics',
    name: 'Get Video Analytics',
    description: 'Get detailed analytics for a specific YouTube video by ID.',
    category: 'owpil',
    enabled: true,
    schema: {
      videoId: { type: 'string', description: 'YouTube video ID (e.g. dQw4w9WgXcQ)' },
    },
    execute: async ({ videoId }: { videoId: string }) => {
      const data = await ytGet('videos', {
        part: 'snippet,statistics,contentDetails,status',
        id: videoId,
      })
      const v = data.items?.[0]
      if (!v) return { error: `Video ${videoId} not found` }
      return {
        id: v.id,
        title: v.snippet.title,
        description: v.snippet.description,
        publishedAt: v.snippet.publishedAt,
        views: v.statistics.viewCount,
        likes: v.statistics.likeCount,
        dislikes: v.statistics.dislikeCount,
        comments: v.statistics.commentCount,
        duration: v.contentDetails.duration,
        status: v.status.privacyStatus,
        url: `https://youtube.com/watch?v=${v.id}`,
        tags: v.snippet.tags,
      }
    },
  },

  {
    id: 'yt_search_videos',
    name: 'Search YouTube Videos',
    description: 'Search for videos on the channel or YouTube-wide by keyword.',
    category: 'owpil',
    enabled: true,
    schema: {
      query: { type: 'string', description: 'Search terms' },
      channelOnly: { type: 'boolean', description: 'Limit search to OWPIL channel only', default: true },
      maxResults: { type: 'number', description: 'Max results (1-25)', default: 5 },
    },
    execute: async ({ query, channelOnly = true, maxResults = 5 }: { query: string; channelOnly?: boolean; maxResults?: number }) => {
      const params: Record<string, string> = {
        part: 'snippet',
        type: 'video',
        q: query,
        maxResults: String(maxResults),
        order: 'relevance',
      }
      if (channelOnly) params.channelId = YT_CHANNEL_ID()
      const data = await ytGet('search', params)
      return data.items.map((i: {
        id: { videoId: string }
        snippet: { title: string; description: string; publishedAt: string; thumbnails: { high: { url: string } } }
      }) => ({
        id: i.id.videoId,
        title: i.snippet.title,
        description: i.snippet.description?.slice(0, 200),
        publishedAt: i.snippet.publishedAt,
        thumbnail: i.snippet.thumbnails?.high?.url,
        url: `https://youtube.com/watch?v=${i.id.videoId}`,
      }))
    },
  },

  {
    id: 'yt_update_video',
    name: 'Update Video Metadata',
    description: 'Update the title, description, or tags of a YouTube video (requires OAuth).',
    category: 'owpil',
    enabled: true,
    schema: {
      videoId: { type: 'string', description: 'YouTube video ID to update' },
      title: { type: 'string', description: 'New title (optional)' },
      description: { type: 'string', description: 'New description (optional)' },
      tags: { type: 'array', description: 'Array of tags (optional)' },
    },
    execute: async ({ videoId, title, description, tags }: { videoId: string; title?: string; description?: string; tags?: string[] }) => {
      const existing = await ytGet('videos', { part: 'snippet', id: videoId })
      const snippet = existing.items?.[0]?.snippet
      if (!snippet) return { error: `Video ${videoId} not found` }
      const updated = await ytPost(`videos?part=snippet`, {
        id: videoId,
        snippet: {
          ...snippet,
          ...(title && { title }),
          ...(description && { description }),
          ...(tags && { tags }),
        },
      })
      return { success: true, updated: updated.snippet }
    },
  },

  {
    id: 'yt_add_comment',
    name: 'Post YouTube Comment',
    description: 'Post a comment on a YouTube video as the channel owner.',
    category: 'owpil',
    enabled: true,
    schema: {
      videoId: { type: 'string', description: 'YouTube video ID' },
      comment: { type: 'string', description: 'Comment text to post' },
    },
    execute: async ({ videoId, comment }: { videoId: string; comment: string }) => {
      const data = await ytPost('commentThreads?part=snippet', {
        snippet: {
          videoId,
          topLevelComment: {
            snippet: { textOriginal: comment },
          },
        },
      })
      return { success: true, commentId: data.id, text: data.snippet?.topLevelComment?.snippet?.textOriginal }
    },
  },

  {
    id: 'yt_get_playlists',
    name: 'Get Channel Playlists',
    description: 'List all playlists on the OWPIL YouTube channel.',
    category: 'owpil',
    enabled: true,
    schema: {},
    execute: async () => {
      const data = await ytGet('playlists', {
        part: 'snippet,contentDetails',
        channelId: YT_CHANNEL_ID(),
        maxResults: '50',
      })
      return data.items.map((p: {
        id: string
        snippet: { title: string; description: string; publishedAt: string }
        contentDetails: { itemCount: number }
      }) => ({
        id: p.id,
        title: p.snippet.title,
        description: p.snippet.description?.slice(0, 150),
        videoCount: p.contentDetails.itemCount,
        publishedAt: p.snippet.publishedAt,
        url: `https://youtube.com/playlist?list=${p.id}`,
      }))
    },
  },
]
