'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MessageSquare, 
  Wrench, 
  FileEdit, 
  Globe, 
  Mic, 
  Home,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/tools', label: 'Tools', icon: Wrench },
  { href: '/dashboard/editor', label: 'Editor', icon: FileEdit },
  { href: '/dashboard/browser', label: 'Browser', icon: Globe },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-card border-r border-border
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
                <span className="text-background font-serif font-bold text-sm">O</span>
              </div>
              <span className="font-serif text-lg text-foreground tracking-wider">O.W.P.I.L</span>
            </Link>
            <button 
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    font-mono text-sm transition-colors
                    ${isActive 
                      ? 'bg-accent/20 text-accent' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          
          {/* Bottom actions */}
          <div className="p-4 border-t border-border space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Home size={18} />
              Back to Site
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Settings size={18} />
              Settings
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden h-16 border-b border-border flex items-center px-4 bg-card">
          <button 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-serif text-lg text-foreground">Dashboard</span>
        </header>
        
        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
