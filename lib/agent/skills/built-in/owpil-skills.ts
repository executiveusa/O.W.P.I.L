import type { AgentSkill } from '../../types'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'

const PROJECT_ROOT = process.cwd()

// O.W.P.I.L specific skills for managing the website
export const owpilSkills: AgentSkill[] = [
  {
    id: 'get_site_structure',
    name: 'Get Site Structure',
    description: 'Get the current structure of the O.W.P.I.L website',
    category: 'owpil',
    schema: {},
    execute: async () => {
      const structure = {
        pages: [
          { path: '/', name: 'Home', components: ['HeroSection', 'TimelineSection', 'GallerySection', 'PhilosophySection', 'ConnectSection', 'Footer'] },
          { path: '/dashboard', name: 'Dashboard', components: ['Chat', 'Tools', 'Editor', 'Browser'] },
        ],
        components: {
          hero: 'components/hero/HeroSection.tsx',
          timeline: 'components/sections/TimelineSection.tsx',
          gallery: 'components/sections/GallerySection.tsx',
          philosophy: 'components/sections/PhilosophySection.tsx',
          connect: 'components/sections/ConnectSection.tsx',
          footer: 'components/footer/Footer.tsx',
        },
        styles: 'app/globals.css',
        config: 'tailwind.config.ts',
      }
      
      return { success: true, structure }
    },
  },
  
  {
    id: 'update_hero_images',
    name: 'Update Hero Images',
    description: 'Update the images displayed in the hero slideshow',
    category: 'owpil',
    schema: {
      images: z.array(z.object({
        url: z.string(),
        alt: z.string(),
      })).describe('Array of image objects with url and alt text'),
    },
    execute: async (args) => {
      const images = args.images as Array<{ url: string; alt: string }>
      const heroPath = path.join(PROJECT_ROOT, 'components/hero/HeroSection.tsx')
      
      try {
        const content = await fs.readFile(heroPath, 'utf-8')
        
        // Generate new images array
        const imagesCode = images
          .map(img => `  { url: '${img.url}', alt: '${img.alt}' },`)
          .join('\n')
        
        // Replace the images array in the file
        const newContent = content.replace(
          /const heroImages = \[[\s\S]*?\]/,
          `const heroImages = [\n${imagesCode}\n]`
        )
        
        await fs.writeFile(heroPath, newContent, 'utf-8')
        
        return { success: true, message: `Updated hero with ${images.length} images` }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update hero' }
      }
    },
  },
  
  {
    id: 'add_timeline_entry',
    name: 'Add Timeline Entry',
    description: 'Add a new entry to the timeline section',
    category: 'owpil',
    schema: {
      period: z.enum(['past', 'present', 'future']).describe('Which timeline period'),
      title: z.string().describe('Entry title'),
      description: z.string().describe('Entry description'),
      year: z.string().optional().describe('Year or time period'),
      image: z.string().optional().describe('Image URL'),
    },
    execute: async (args) => {
      // Store timeline entries in a data file
      const dataPath = path.join(PROJECT_ROOT, 'data/timeline.json')
      
      let timeline: Record<string, Array<{ title: string; description: string; year?: string; image?: string }>> = {
        past: [],
        present: [],
        future: [],
      }
      
      try {
        const existing = await fs.readFile(dataPath, 'utf-8')
        timeline = JSON.parse(existing)
      } catch {
        // File doesn't exist, use default
      }
      
      const period = args.period as 'past' | 'present' | 'future'
      timeline[period].push({
        title: args.title as string,
        description: args.description as string,
        year: args.year as string | undefined,
        image: args.image as string | undefined,
      })
      
      await fs.mkdir(path.dirname(dataPath), { recursive: true })
      await fs.writeFile(dataPath, JSON.stringify(timeline, null, 2))
      
      return { success: true, message: `Added entry to ${period} timeline` }
    },
  },
  
  {
    id: 'add_gallery_image',
    name: 'Add Gallery Image',
    description: 'Add a new image to the gallery',
    category: 'owpil',
    schema: {
      url: z.string().describe('Image URL'),
      alt: z.string().describe('Alt text for the image'),
      category: z.string().describe('Category (e.g., travel, portraits, art)'),
      location: z.string().optional().describe('Location where photo was taken'),
    },
    execute: async (args) => {
      const dataPath = path.join(PROJECT_ROOT, 'data/gallery.json')
      
      let gallery: Array<{ url: string; alt: string; category: string; location?: string }> = []
      
      try {
        const existing = await fs.readFile(dataPath, 'utf-8')
        gallery = JSON.parse(existing)
      } catch {
        // File doesn't exist
      }
      
      gallery.push({
        url: args.url as string,
        alt: args.alt as string,
        category: args.category as string,
        location: args.location as string | undefined,
      })
      
      await fs.mkdir(path.dirname(dataPath), { recursive: true })
      await fs.writeFile(dataPath, JSON.stringify(gallery, null, 2))
      
      return { success: true, message: `Added image to gallery`, total: gallery.length }
    },
  },
  
  {
    id: 'update_philosophy',
    name: 'Update Philosophy',
    description: 'Update a philosophy/belief entry',
    category: 'owpil',
    schema: {
      beliefs: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      })).describe('Array of belief objects'),
    },
    execute: async (args) => {
      const dataPath = path.join(PROJECT_ROOT, 'data/philosophy.json')
      const beliefs = args.beliefs as Array<{ title: string; description: string; icon?: string }>
      
      await fs.mkdir(path.dirname(dataPath), { recursive: true })
      await fs.writeFile(dataPath, JSON.stringify(beliefs, null, 2))
      
      return { success: true, message: `Updated philosophy with ${beliefs.length} beliefs` }
    },
  },
  
  {
    id: 'get_current_content',
    name: 'Get Current Content',
    description: 'Get the current content data for the website',
    category: 'owpil',
    schema: {
      section: z.enum(['timeline', 'gallery', 'philosophy', 'all']).describe('Which section to retrieve'),
    },
    execute: async (args) => {
      const section = args.section as string
      const dataDir = path.join(PROJECT_ROOT, 'data')
      
      const result: Record<string, unknown> = {}
      
      const readJson = async (name: string) => {
        try {
          const content = await fs.readFile(path.join(dataDir, `${name}.json`), 'utf-8')
          return JSON.parse(content)
        } catch {
          return null
        }
      }
      
      if (section === 'all' || section === 'timeline') {
        result.timeline = await readJson('timeline')
      }
      if (section === 'all' || section === 'gallery') {
        result.gallery = await readJson('gallery')
      }
      if (section === 'all' || section === 'philosophy') {
        result.philosophy = await readJson('philosophy')
      }
      
      return { success: true, content: result }
    },
  },
]
