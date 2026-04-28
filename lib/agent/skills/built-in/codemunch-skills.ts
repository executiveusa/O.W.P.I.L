import type { AgentSkill, SkillExecutionContext } from '../../types'
import { z } from 'zod'

// jCodeMunch MCP Integration
// Token-efficient code exploration via tree-sitter AST parsing
// https://github.com/jgravelle/jcodemunch-mcp

const CODEMUNCH_ENDPOINT = process.env.CODEMUNCH_MCP_URL || 'http://localhost:3001'

async function callCodeMunch(tool: string, args: Record<string, unknown>) {
  try {
    const response = await fetch(`${CODEMUNCH_ENDPOINT}/mcp/tools/${tool}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CODEMUNCH_API_KEY || ''}`,
      },
      body: JSON.stringify(args),
    })
    
    if (!response.ok) {
      throw new Error(`CodeMunch API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('CodeMunch call failed:', error)
    throw error
  }
}

export const codemunchSkills: AgentSkill[] = [
  {
    id: 'code_search_symbols',
    name: 'Search Code Symbols',
    description: 'Search for functions, classes, methods by name. 95% more token-efficient than reading full files.',
    category: 'system',
    schema: {
      query: z.string().describe('Symbol name or pattern to search for'),
      kind: z.enum(['function', 'class', 'method', 'constant', 'any']).optional().describe('Type of symbol'),
      limit: z.number().optional().describe('Max results (default 10)'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { query, kind, limit = 10 } = args as { query: string; kind?: string; limit?: number }
      
      return await callCodeMunch('search_symbols', {
        query,
        kind: kind || 'any',
        limit,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_get_symbol',
    name: 'Get Symbol Source',
    description: 'Retrieve exact source code for a specific symbol by name.',
    category: 'system',
    schema: {
      name: z.string().describe('Fully qualified symbol name'),
      include_context: z.boolean().optional().describe('Include surrounding context'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { name, include_context = false } = args as { name: string; include_context?: boolean }
      
      return await callCodeMunch('get_symbol_source', {
        name,
        include_context,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_get_outline',
    name: 'Get File Outline',
    description: 'Get a structured outline of a file (functions, classes, imports) without reading the whole file.',
    category: 'system',
    schema: {
      path: z.string().describe('File path relative to project root'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { path } = args as { path: string }
      
      return await callCodeMunch('get_file_outline', {
        path,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_find_references',
    name: 'Find References',
    description: 'Find all places where a symbol is used across the codebase.',
    category: 'system',
    schema: {
      identifier: z.string().describe('Symbol name to find references for'),
      limit: z.number().optional().describe('Max results'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { identifier, limit = 20 } = args as { identifier: string; limit?: number }
      
      return await callCodeMunch('find_references', {
        identifier,
        limit,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_get_blast_radius',
    name: 'Get Blast Radius',
    description: 'Analyze what would break if a symbol is changed. Essential for safe refactoring.',
    category: 'system',
    schema: {
      symbol: z.string().describe('Symbol to analyze'),
      depth: z.number().optional().describe('How many levels deep to trace (default 2)'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { symbol, depth = 2 } = args as { symbol: string; depth?: number }
      
      return await callCodeMunch('get_blast_radius', {
        symbol,
        depth,
        include_snippets: true,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_find_dead_code',
    name: 'Find Dead Code',
    description: 'Find unreachable symbols and files with no imports.',
    category: 'system',
    schema: {
      path: z.string().optional().describe('Limit search to specific directory'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { path } = args as { path?: string }
      
      return await callCodeMunch('find_dead_code', {
        path,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_get_call_hierarchy',
    name: 'Get Call Hierarchy',
    description: 'Trace callers and callees of a function N levels deep.',
    category: 'system',
    schema: {
      symbol: z.string().describe('Function/method name'),
      direction: z.enum(['callers', 'callees', 'both']).optional().describe('Direction to trace'),
      depth: z.number().optional().describe('Levels to trace (default 3)'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { symbol, direction = 'both', depth = 3 } = args as { 
        symbol: string; direction?: string; depth?: number 
      }
      
      return await callCodeMunch('get_call_hierarchy', {
        symbol,
        direction,
        depth,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_get_class_hierarchy',
    name: 'Get Class Hierarchy',
    description: 'Traverse inheritance chains for a class.',
    category: 'system',
    schema: {
      class_name: z.string().describe('Class name to analyze'),
      direction: z.enum(['ancestors', 'descendants', 'both']).optional(),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { class_name, direction = 'both' } = args as { class_name: string; direction?: string }
      
      return await callCodeMunch('get_class_hierarchy', {
        class_name,
        direction,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_search_ast',
    name: 'Search AST Patterns',
    description: 'Find anti-patterns like empty catch blocks, deeply nested code, hardcoded secrets.',
    category: 'system',
    schema: {
      category: z.enum(['security', 'error_handling', 'complexity', 'performance', 'maintenance', 'all']).describe('Pattern category'),
      path: z.string().optional().describe('Limit to specific directory'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { category, path } = args as { category: string; path?: string }
      
      return await callCodeMunch('search_ast', {
        category,
        path,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_get_hotspots',
    name: 'Get Code Hotspots',
    description: 'Find riskiest code by combining complexity with git churn.',
    category: 'system',
    schema: {
      limit: z.number().optional().describe('Max results (default 10)'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { limit = 10 } = args as { limit?: number }
      
      return await callCodeMunch('get_hotspots', {
        limit,
        format: 'compact',
      })
    },
  },
  
  {
    id: 'code_index_repo',
    name: 'Index Repository',
    description: 'Index a local folder or GitHub repo for code exploration.',
    category: 'system',
    schema: {
      path: z.string().describe('Local path or GitHub URL to index'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const { path } = args as { path: string }
      
      return await callCodeMunch('index_repo', {
        path,
      })
    },
  },
]
