import type { AgentSkill } from '../../types'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'

// Security: Restrict file operations to project directory
const PROJECT_ROOT = process.cwd()

function isPathSafe(filePath: string): boolean {
  const resolved = path.resolve(PROJECT_ROOT, filePath)
  // Use path.relative to check if the resolved path is within PROJECT_ROOT
  // This prevents sibling directory prefix attacks
  const relative = path.relative(PROJECT_ROOT, resolved)
  // If relative path starts with '..' or is absolute, it's outside PROJECT_ROOT
  return !relative.startsWith('..') && !path.isAbsolute(relative)
}

export const fileSkills: AgentSkill[] = [
  {
    id: 'read_file',
    name: 'Read File',
    description: 'Read the contents of a file from the project',
    category: 'file',
    schema: {
      path: z.string().describe('Relative path to the file from project root'),
    },
    execute: async (args) => {
      const filePath = args.path as string
      if (!isPathSafe(filePath)) {
        throw new Error('Access denied: Path outside project directory')
      }
      const fullPath = path.join(PROJECT_ROOT, filePath)
      const content = await fs.readFile(fullPath, 'utf-8')
      return { success: true, content, path: filePath }
    },
  },
  
  {
    id: 'write_file',
    name: 'Write File',
    description: 'Write content to a file in the project',
    category: 'file',
    schema: {
      path: z.string().describe('Relative path to the file'),
      content: z.string().describe('Content to write to the file'),
    },
    execute: async (args) => {
      const filePath = args.path as string
      const content = args.content as string
      
      if (!isPathSafe(filePath)) {
        throw new Error('Access denied: Path outside project directory')
      }
      
      const fullPath = path.join(PROJECT_ROOT, filePath)
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true })
      
      await fs.writeFile(fullPath, content, 'utf-8')
      return { success: true, path: filePath, bytesWritten: content.length }
    },
  },
  
  {
    id: 'list_files',
    name: 'List Files',
    description: 'List files and directories in a path',
    category: 'file',
    schema: {
      path: z.string().optional().describe('Relative path to list (default: project root)'),
      pattern: z.string().optional().describe('Glob pattern to filter files'),
    },
    execute: async (args) => {
      const dirPath = (args.path as string) || '.'
      
      if (!isPathSafe(dirPath)) {
        throw new Error('Access denied: Path outside project directory')
      }
      
      const fullPath = path.join(PROJECT_ROOT, dirPath)
      const entries = await fs.readdir(fullPath, { withFileTypes: true })
      
      const files = entries.map(entry => ({
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
        path: path.join(dirPath, entry.name),
      }))
      
      return { success: true, files, directory: dirPath }
    },
  },
  
  {
    id: 'edit_file',
    name: 'Edit File',
    description: 'Make a targeted edit to a file by replacing specific text',
    category: 'file',
    schema: {
      path: z.string().describe('Relative path to the file'),
      oldText: z.string().describe('The exact text to find and replace'),
      newText: z.string().describe('The replacement text'),
    },
    execute: async (args) => {
      const filePath = args.path as string
      const oldText = args.oldText as string
      const newText = args.newText as string
      
      if (!isPathSafe(filePath)) {
        throw new Error('Access denied: Path outside project directory')
      }
      
      const fullPath = path.join(PROJECT_ROOT, filePath)
      const content = await fs.readFile(fullPath, 'utf-8')
      
      if (!content.includes(oldText)) {
        return { success: false, error: 'Text not found in file' }
      }
      
      const newContent = content.replace(oldText, newText)
      await fs.writeFile(fullPath, newContent, 'utf-8')
      
      return { success: true, path: filePath, replaced: true }
    },
  },
  
  {
    id: 'delete_file',
    name: 'Delete File',
    description: 'Delete a file from the project',
    category: 'file',
    schema: {
      path: z.string().describe('Relative path to the file to delete'),
    },
    execute: async (args) => {
      const filePath = args.path as string
      
      if (!isPathSafe(filePath)) {
        throw new Error('Access denied: Path outside project directory')
      }
      
      // Extra safety: don't allow deleting critical files
      const criticalPaths = ['package.json', 'next.config.ts', 'app/layout.tsx']
      if (criticalPaths.includes(filePath)) {
        throw new Error('Cannot delete critical project files')
      }
      
      const fullPath = path.join(PROJECT_ROOT, filePath)
      await fs.unlink(fullPath)
      
      return { success: true, path: filePath, deleted: true }
    },
  },
]
