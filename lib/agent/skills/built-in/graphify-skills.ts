import type { AgentSkill, SkillExecutionContext } from '../../types'
import { z } from 'zod'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// Graphify integration skills - turn code/docs into queryable knowledge graphs
export const graphifySkills: AgentSkill[] = [
  {
    id: 'graphify_build_graph',
    name: 'Build Knowledge Graph',
    description: 'Build a knowledge graph from a folder of code, docs, images, or videos using graphify',
    category: 'web',
    schema: {
      folder_path: z.string().describe('The folder path to build graph from (e.g., ./src, ./docs)'),
      output_dir: z.string().optional().describe('Output directory for graph (default: graphify-out)'),
      mode: z.enum(['fast', 'deep']).optional().describe('Extraction mode: fast or deep (default: fast)'),
      watch: z.boolean().optional().describe('Enable auto-watch for file changes'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const folderPath = args.folder_path as string
      const outputDir = (args.output_dir as string) || 'graphify-out'
      const mode = (args.mode as string) || 'fast'
      const watch = (args.watch as boolean) || false

      try {
        // Ensure graphify is installed
        try {
          execSync('graphify --version', { stdio: 'pipe' })
        } catch {
          return {
            success: false,
            error: 'graphify not installed. Run: pip install graphifyy',
          }
        }

        // Build the graph
        let cmd = `graphify ${folderPath}`
        if (mode === 'deep') cmd += ' --mode deep'
        if (watch) cmd += ' --watch'
        cmd += ` --out ${outputDir}`

        const result = execSync(cmd, { encoding: 'utf-8' })

        // Read the graph report
        const reportPath = path.join(outputDir, 'GRAPH_REPORT.md')
        const report = fs.existsSync(reportPath)
          ? fs.readFileSync(reportPath, 'utf-8')
          : 'Graph built successfully'

        return {
          success: true,
          message: 'Knowledge graph built',
          report: report.substring(0, 2000), // First 2000 chars
          output_dir: outputDir,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to build graph',
        }
      }
    },
  },

  {
    id: 'graphify_query_graph',
    name: 'Query Knowledge Graph',
    description: 'Query the knowledge graph with natural language questions',
    category: 'web',
    schema: {
      query: z.string().describe('Natural language question to ask the graph'),
      graph_path: z.string().optional().describe('Path to graph.json (default: graphify-out/graph.json)'),
      budget: z.number().optional().describe('Token budget for response (default: 2000)'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const query = args.query as string
      const graphPath = (args.graph_path as string) || 'graphify-out/graph.json'
      const budget = (args.budget as number) || 2000

      try {
        if (!fs.existsSync(graphPath)) {
          return {
            success: false,
            error: `Graph not found at ${graphPath}. Run 'graphify_build_graph' first.`,
          }
        }

        const cmd = `graphify query "${query}" --graph ${graphPath} --budget ${budget}`
        const result = execSync(cmd, { encoding: 'utf-8' })

        return {
          success: true,
          result: result.substring(0, 3000),
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Query failed',
        }
      }
    },
  },

  {
    id: 'graphify_find_path',
    name: 'Find Connection Path',
    description: 'Find the shortest path between two concepts in the knowledge graph',
    category: 'web',
    schema: {
      from_node: z.string().describe('Starting concept/node name'),
      to_node: z.string().describe('Target concept/node name'),
      graph_path: z.string().optional().describe('Path to graph.json'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const fromNode = args.from_node as string
      const toNode = args.to_node as string
      const graphPath = (args.graph_path as string) || 'graphify-out/graph.json'

      try {
        if (!fs.existsSync(graphPath)) {
          return {
            success: false,
            error: `Graph not found at ${graphPath}`,
          }
        }

        const cmd = `graphify path "${fromNode}" "${toNode}" --graph ${graphPath}`
        const result = execSync(cmd, { encoding: 'utf-8' })

        return {
          success: true,
          path: result.substring(0, 2000),
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Path search failed',
        }
      }
    },
  },

  {
    id: 'graphify_explain_node',
    name: 'Explain Node',
    description: 'Get a plain-language explanation of a concept from the graph',
    category: 'web',
    schema: {
      node_name: z.string().describe('Name of the concept/node to explain'),
      graph_path: z.string().optional().describe('Path to graph.json'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const nodeName = args.node_name as string
      const graphPath = (args.graph_path as string) || 'graphify-out/graph.json'

      try {
        if (!fs.existsSync(graphPath)) {
          return {
            success: false,
            error: `Graph not found at ${graphPath}`,
          }
        }

        const cmd = `graphify explain "${nodeName}" --graph ${graphPath}`
        const result = execSync(cmd, { encoding: 'utf-8' })

        return {
          success: true,
          explanation: result.substring(0, 2000),
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Explanation failed',
        }
      }
    },
  },
]
