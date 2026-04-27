'use client'

import { useState } from 'react'
import { 
  FileText, 
  Globe, 
  Image, 
  MessageSquare, 
  Search,
  Edit,
  Trash2,
  FolderOpen,
  Clock,
  CheckCircle,
  XCircle,
  Play
} from 'lucide-react'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: React.ElementType
  enabled: boolean
  lastUsed?: string
}

const tools: Tool[] = [
  {
    id: 'read_file',
    name: 'Read File',
    description: 'Read contents of files in the project',
    category: 'file',
    icon: FileText,
    enabled: true,
    lastUsed: '2 minutes ago',
  },
  {
    id: 'write_file',
    name: 'Write File',
    description: 'Create or overwrite files',
    category: 'file',
    icon: Edit,
    enabled: true,
  },
  {
    id: 'edit_file',
    name: 'Edit File',
    description: 'Make targeted edits to files',
    category: 'file',
    icon: Edit,
    enabled: true,
    lastUsed: '5 minutes ago',
  },
  {
    id: 'list_files',
    name: 'List Files',
    description: 'List directory contents',
    category: 'file',
    icon: FolderOpen,
    enabled: true,
  },
  {
    id: 'delete_file',
    name: 'Delete File',
    description: 'Remove files from the project',
    category: 'file',
    icon: Trash2,
    enabled: false, // Disabled by default for safety
  },
  {
    id: 'web_search',
    name: 'Web Search',
    description: 'Search the web for information',
    category: 'web',
    icon: Search,
    enabled: true,
    lastUsed: '1 hour ago',
  },
  {
    id: 'fetch_url',
    name: 'Fetch URL',
    description: 'Retrieve content from URLs',
    category: 'web',
    icon: Globe,
    enabled: true,
  },
  {
    id: 'search_artists',
    name: 'Search Artists',
    description: 'Find artists and creatives',
    category: 'web',
    icon: Search,
    enabled: true,
  },
  {
    id: 'update_hero_images',
    name: 'Update Hero',
    description: 'Change hero slideshow images',
    category: 'owpil',
    icon: Image,
    enabled: true,
  },
  {
    id: 'add_timeline_entry',
    name: 'Add Timeline',
    description: 'Add entries to the timeline',
    category: 'owpil',
    icon: Clock,
    enabled: true,
  },
  {
    id: 'add_gallery_image',
    name: 'Add Gallery',
    description: 'Add images to the gallery',
    category: 'owpil',
    icon: Image,
    enabled: true,
  },
]

const categories = [
  { id: 'all', label: 'All Tools' },
  { id: 'file', label: 'File Operations' },
  { id: 'web', label: 'Web & Search' },
  { id: 'owpil', label: 'Website' },
]

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [toolStates, setToolStates] = useState<Record<string, boolean>>(
    Object.fromEntries(tools.map(t => [t.id, t.enabled]))
  )
  
  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category === activeCategory)
  
  const toggleTool = (id: string) => {
    setToolStates(prev => ({ ...prev, [id]: !prev[id] }))
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground mb-2">Tools & Skills</h1>
        <p className="text-muted-foreground font-mono text-sm">
          Manage the capabilities available to your AI assistant
        </p>
      </div>
      
      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              px-4 py-2 rounded-full font-mono text-sm whitespace-nowrap transition-colors
              ${activeCategory === cat.id
                ? 'bg-accent text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-serif text-foreground">
            {Object.values(toolStates).filter(Boolean).length}
          </div>
          <div className="text-sm text-muted-foreground font-mono">Active Tools</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-serif text-foreground">
            {tools.filter(t => t.lastUsed).length}
          </div>
          <div className="text-sm text-muted-foreground font-mono">Recently Used</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-serif text-foreground">{tools.length}</div>
          <div className="text-sm text-muted-foreground font-mono">Total Available</div>
        </div>
      </div>
      
      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const isEnabled = toolStates[tool.id]
          const Icon = tool.icon
          
          return (
            <div
              key={tool.id}
              className={`
                bg-card border rounded-xl p-4 transition-all
                ${isEnabled ? 'border-border' : 'border-border/50 opacity-60'}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${isEnabled ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}
                `}>
                  <Icon size={20} />
                </div>
                <button
                  onClick={() => toggleTool(tool.id)}
                  className={`
                    w-12 h-6 rounded-full transition-colors relative
                    ${isEnabled ? 'bg-accent' : 'bg-muted'}
                  `}
                >
                  <div className={`
                    absolute top-1 w-4 h-4 rounded-full bg-background transition-transform
                    ${isEnabled ? 'right-1' : 'left-1'}
                  `} />
                </button>
              </div>
              
              <h3 className="font-serif text-lg text-foreground mb-1">{tool.name}</h3>
              <p className="text-sm text-muted-foreground font-mono mb-3">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`
                  text-xs font-mono px-2 py-1 rounded
                  ${tool.category === 'file' ? 'bg-blue-500/10 text-blue-400' :
                    tool.category === 'web' ? 'bg-green-500/10 text-green-400' :
                    'bg-accent/10 text-accent'}
                `}>
                  {tool.category}
                </span>
                
                {tool.lastUsed && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {tool.lastUsed}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
