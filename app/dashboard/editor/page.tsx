'use client'

import { useState } from 'react'
import { 
  FileText, 
  Image, 
  Clock, 
  Lightbulb, 
  Save,
  Eye,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react'

interface ContentSection {
  id: string
  name: string
  description: string
  icon: React.ElementType
  fields: ContentField[]
}

interface ContentField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image' | 'array'
  value: string | string[]
}

const sections: ContentSection[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Main landing area with slideshow images',
    icon: Image,
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'text', value: 'One Without Purpose Is Lost' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', value: 'Tyshawn • The Paulie Effect' },
    ],
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Past, Present, Future narrative sections',
    icon: Clock,
    fields: [
      { key: 'past_title', label: 'Past Title', type: 'text', value: 'The Journey Behind' },
      { key: 'present_title', label: 'Present Title', type: 'text', value: 'The Now' },
      { key: 'future_title', label: 'Future Title', type: 'text', value: 'The Vision Ahead' },
    ],
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Photo and art gallery with categories',
    icon: Image,
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', value: 'Visual Stories' },
      { key: 'categories', label: 'Categories', type: 'array', value: ['All', 'Travel', 'Portraits', 'Art'] },
    ],
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    description: 'Core beliefs and values',
    icon: Lightbulb,
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', value: 'Core Beliefs' },
      { key: 'intro', label: 'Introduction', type: 'textarea', value: 'The principles that guide the journey...' },
    ],
  },
]

export default function EditorPage() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [editedFields, setEditedFields] = useState<Record<string, Record<string, string | string[]>>>({})
  const [hasChanges, setHasChanges] = useState(false)
  
  const currentSection = sections.find(s => s.id === activeSection)
  
  const handleFieldChange = (sectionId: string, fieldKey: string, value: string | string[]) => {
    setEditedFields(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldKey]: value,
      },
    }))
    setHasChanges(true)
  }
  
  const getFieldValue = (sectionId: string, field: ContentField) => {
    return editedFields[sectionId]?.[field.key] ?? field.value
  }
  
  const handleSave = async () => {
    // In production, this would call the agent API to update files
    console.log('Saving changes:', editedFields)
    setHasChanges(false)
    alert('Changes saved! (In production, this would update the actual files)')
  }
  
  return (
    <div className="h-full flex">
      {/* Sidebar - Section List */}
      <div className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-serif text-lg text-foreground">Site Content</h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">Edit website sections</p>
        </div>
        
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                  ${isActive 
                    ? 'bg-accent/20 text-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon size={18} />
                <span className="font-mono text-sm">{section.name}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </button>
            )
          })}
        </nav>
      </div>
      
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50">
          <div>
            <h1 className="font-serif text-xl text-foreground">{currentSection?.name}</h1>
            <p className="text-xs text-muted-foreground font-mono">{currentSection?.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
            >
              <Eye size={16} />
              Preview
              <ExternalLink size={12} />
            </a>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-colors
                ${hasChanges 
                  ? 'bg-accent text-background hover:bg-accent/90' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
        
        {/* Editor Fields */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl space-y-6">
            {currentSection?.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-mono text-foreground mb-2">
                  {field.label}
                </label>
                
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={getFieldValue(currentSection.id, field) as string}
                    onChange={(e) => handleFieldChange(currentSection.id, field.key, e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm focus:outline-none focus:border-accent/50"
                  />
                )}
                
                {field.type === 'textarea' && (
                  <textarea
                    value={getFieldValue(currentSection.id, field) as string}
                    onChange={(e) => handleFieldChange(currentSection.id, field.key, e.target.value)}
                    rows={4}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm focus:outline-none focus:border-accent/50 resize-none"
                  />
                )}
                
                {field.type === 'array' && (
                  <div className="space-y-2">
                    {(getFieldValue(currentSection.id, field) as string[]).map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newArray = [...(getFieldValue(currentSection.id, field) as string[])]
                            newArray[index] = e.target.value
                            handleFieldChange(currentSection.id, field.key, newArray)
                          }}
                          className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-foreground font-mono text-sm focus:outline-none focus:border-accent/50"
                        />
                        <button
                          onClick={() => {
                            const newArray = (getFieldValue(currentSection.id, field) as string[]).filter((_, i) => i !== index)
                            handleFieldChange(currentSection.id, field.key, newArray)
                          }}
                          className="w-10 h-10 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newArray = [...(getFieldValue(currentSection.id, field) as string[]), '']
                        handleFieldChange(currentSection.id, field.key, newArray)
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-accent/50 font-mono text-sm transition-colors"
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Quick Actions */}
            <div className="pt-6 border-t border-border">
              <h3 className="font-serif text-lg text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 font-mono text-sm transition-colors">
                  <Image size={18} />
                  Add Image
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 font-mono text-sm transition-colors">
                  <FileText size={18} />
                  View Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
