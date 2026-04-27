import type { AgentSkill } from '../../types'
import { z } from 'zod'

export const webSkills: AgentSkill[] = [
  {
    id: 'web_search',
    name: 'Web Search',
    description: 'Search the web for information',
    category: 'web',
    schema: {
      query: z.string().describe('The search query'),
      maxResults: z.number().optional().describe('Maximum number of results (default: 5)'),
    },
    execute: async (args) => {
      const query = args.query as string
      const maxResults = (args.maxResults as number) || 5
      
      // Use a search API - for now, return a placeholder
      // In production, integrate with SerpAPI, Bing Search, or similar
      try {
        const response = await fetch(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
        )
        const data = await response.json()
        
        return {
          success: true,
          query,
          results: data.RelatedTopics?.slice(0, maxResults).map((topic: { Text: string; FirstURL: string }) => ({
            title: topic.Text?.substring(0, 100),
            url: topic.FirstURL,
            snippet: topic.Text,
          })) || [],
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Search failed',
        }
      }
    },
  },
  
  {
    id: 'fetch_url',
    name: 'Fetch URL',
    description: 'Fetch content from a URL',
    category: 'web',
    schema: {
      url: z.string().describe('The URL to fetch'),
      selector: z.string().optional().describe('CSS selector to extract specific content'),
    },
    execute: async (args) => {
      const url = args.url as string
      
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'OWPIL-Agent/1.0',
          },
        })
        
        if (!response.ok) {
          return { success: false, error: `HTTP ${response.status}` }
        }
        
        const contentType = response.headers.get('content-type') || ''
        
        if (contentType.includes('application/json')) {
          const json = await response.json()
          return { success: true, url, contentType: 'json', data: json }
        }
        
        const text = await response.text()
        
        // Basic HTML to text conversion
        const plainText = text
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 5000) // Limit content length
        
        return {
          success: true,
          url,
          contentType: 'html',
          content: plainText,
          length: plainText.length,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Fetch failed',
        }
      }
    },
  },
  
  {
    id: 'search_artists',
    name: 'Search Artists',
    description: 'Search for artists, musicians, or creative professionals',
    category: 'web',
    schema: {
      query: z.string().describe('Artist name or search term'),
      type: z.enum(['musician', 'visual', 'any']).optional().describe('Type of artist'),
    },
    execute: async (args) => {
      const query = args.query as string
      const type = (args.type as string) || 'any'
      
      // Search multiple sources
      const searchQuery = type === 'any' 
        ? query 
        : `${query} ${type} artist`
      
      try {
        // Use DuckDuckGo as a basic search
        const response = await fetch(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json`
        )
        const data = await response.json()
        
        return {
          success: true,
          query,
          type,
          results: {
            abstract: data.Abstract,
            relatedTopics: data.RelatedTopics?.slice(0, 5).map((t: { Text: string; FirstURL: string }) => ({
              text: t.Text,
              url: t.FirstURL,
            })),
            infobox: data.Infobox,
          },
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Search failed',
        }
      }
    },
  },
]
