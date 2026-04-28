-- Create tables for O.W.P.I.L website

-- Users/Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT CHECK (category IN ('Life', 'Anime', 'Art', 'Travel', 'Philosophy')),
  published BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Photo/Gallery table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT CHECK (category IN ('Past', 'Present', 'Future', 'Art', 'Other')),
  tags TEXT[],
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline content table
CREATE TABLE IF NOT EXISTS public.timeline_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('Past', 'Present', 'Future')),
  title TEXT,
  content TEXT,
  japanese_quote TEXT,
  japanese_translation TEXT,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent configuration table
CREATE TABLE IF NOT EXISTS public.agent_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name TEXT DEFAULT 'Sensei',
  agent_avatar TEXT,
  personality_traits TEXT,
  specialization TEXT DEFAULT 'anime_expert',
  email_address TEXT,
  enable_daily_inspiration BOOLEAN DEFAULT TRUE,
  enable_weekly_recommendations BOOLEAN DEFAULT TRUE,
  enable_backup_jobs BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cron jobs/scheduled tasks table
CREATE TABLE IF NOT EXISTS public.scheduled_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('daily', 'weekly', 'monthly', 'custom')),
  schedule_time TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics/Dashboard stats
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for blog_posts
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
  FOR SELECT USING (published = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own posts" ON public.blog_posts
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for photos
CREATE POLICY "Anyone can view photos" ON public.photos
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own photos" ON public.photos
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for timeline_content
CREATE POLICY "Anyone can view timeline" ON public.timeline_content
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own timeline" ON public.timeline_content
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for agent_config
CREATE POLICY "Users can view their own agent config" ON public.agent_config
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own agent config" ON public.agent_config
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for scheduled_tasks
CREATE POLICY "Users can manage their own tasks" ON public.scheduled_tasks
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for analytics
CREATE POLICY "Users can view their own analytics" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert analytics" ON public.analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_user ON public.blog_posts(user_id);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);

CREATE INDEX idx_photos_user ON public.photos(user_id);
CREATE INDEX idx_photos_category ON public.photos(category);
CREATE INDEX idx_photos_tags ON public.photos USING GIN(tags);

CREATE INDEX idx_timeline_user ON public.timeline_content(user_id);
CREATE INDEX idx_timeline_section ON public.timeline_content(section);

CREATE INDEX idx_scheduled_tasks_user ON public.scheduled_tasks(user_id);
CREATE INDEX idx_scheduled_tasks_enabled ON public.scheduled_tasks(enabled);

CREATE INDEX idx_analytics_user ON public.analytics(user_id);
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX idx_analytics_created ON public.analytics(created_at DESC);
