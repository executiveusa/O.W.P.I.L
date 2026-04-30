'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  MessageSquare, 
  Wrench, 
  FileEdit, 
  Globe, 
  Home,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bot
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/agent', label: 'Agent', icon: Bot },
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
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }
  
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
        w-56 sm:w-64 bg-card border-r border-border
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-background font-serif font-bold text-xs sm:text-sm">O</span>
              </div>
              <span className="font-serif text-sm sm:text-lg text-foreground tracking-wider truncate">O.W.P.I.L</span>
            </Link>
            <button 
              className="lg:hidden text-muted-foreground hover:text-foreground flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          {/* User info */}
          {user && (
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-accent sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg
                    font-mono text-xs sm:text-sm transition-colors
                    ${isActive 
                      ? 'bg-accent/20 text-accent' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <item.icon size={16} className="flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Bottom actions */}
          <div className="p-3 sm:p-4 border-t border-border space-y-1">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg font-mono text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Home size={16} className="flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <span className="truncate hidden sm:inline">Back to Site</span>
              <span className="truncate sm:hidden">Site</span>
            </Link>
            <button className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg font-mono text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Settings size={16} className="flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <span className="truncate hidden sm:inline">Settings</span>
              <span className="truncate sm:hidden">Config</span>
            </button>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg font-mono text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <LogOut size={16} className="flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <span className="truncate">{isLoggingOut ? '...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden h-12 sm:h-16 border-b border-border flex items-center px-3 sm:px-4 bg-card gap-3 sm:gap-4">
          <button 
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} className="sm:w-[24px] sm:h-[24px]" />
          </button>
          <span className="font-serif text-base sm:text-lg text-foreground">Dashboard</span>
        </header>
        
        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
