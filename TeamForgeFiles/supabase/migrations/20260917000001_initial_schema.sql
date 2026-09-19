-- TeamForge Full PostgreSQL Schema & Row Level Security (RLS) Policies
-- Migration: 20260917000001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  college TEXT,
  bio TEXT,
  role TEXT DEFAULT 'Full Stack Developer',
  experience TEXT DEFAULT 'Intermediate',
  availability TEXT DEFAULT '15-20 hrs/week',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  credits INTEGER DEFAULT 200,
  review_count INTEGER DEFAULT 0,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skills Table & User Skills Mapping
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT
);

CREATE TABLE IF NOT EXISTS public.user_skills (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency TEXT DEFAULT 'Intermediate',
  PRIMARY KEY (user_id, skill_id)
);

-- 3. Projects Showcase Table
CREATE TABLE IF NOT EXISTS public.user_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  project_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  domain TEXT NOT NULL,
  hackathon_target TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  max_members INTEGER DEFAULT 5,
  visibility TEXT DEFAULT 'public', -- 'public' or 'private'
  required_skills TEXT[],
  required_roles TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Team Members Table (Core Members)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  is_lead BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 6. Guest Members Table (Cross-team temporary contributors)
CREATE TABLE IF NOT EXISTS public.guest_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialist_role TEXT NOT NULL,
  invited_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(team_id, user_id)
);

-- 7. Join Requests & Invitations Table
CREATE TABLE IF NOT EXISTS public.team_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'join_request' or 'invitation'
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'cancelled'
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Real-Time Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name TEXT,
  sender_avatar TEXT,
  content TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT false,
  ai_meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Team Workspace Kanban Tasks Table
CREATE TABLE IF NOT EXISTS public.team_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'completed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Reviews, Ratings & Reputation Credits Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  team_name TEXT,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  credits_awarded INTEGER DEFAULT 100,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Platform-Wide Opportunities / Specialist Postings Table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT DEFAULT 'Specialist / Guest Contributor',
  domain TEXT NOT NULL,
  required_skills TEXT[],
  credits_reward INTEGER DEFAULT 300,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  deadline DATE,
  applicant_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Hackathons & Events Table
CREATE TABLE IF NOT EXISTS public.hackathons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  description TEXT,
  dates TEXT NOT NULL,
  deadline TEXT,
  prize TEXT,
  tags TEXT[],
  location TEXT,
  mode TEXT DEFAULT 'Online',
  registration_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id TEXT,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
---------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self-edit only
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Teams: Public read for public teams, members for private
CREATE POLICY "Teams viewable by all" ON public.teams FOR SELECT USING (visibility = 'public' OR auth.uid() = owner_id);
CREATE POLICY "Team owners can update their teams" ON public.teams FOR ALL USING (auth.uid() = owner_id);

-- Chat Messages: Only team members and invited guest members can read/post
CREATE POLICY "Team members and guests can read messages" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = chat_messages.team_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.guest_members WHERE team_id = chat_messages.team_id AND user_id = auth.uid())
  );

CREATE POLICY "Team members and guests can insert messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = chat_messages.team_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.guest_members WHERE team_id = chat_messages.team_id AND user_id = auth.uid())
  );

-- Tasks: Team members can manage tasks
CREATE POLICY "Team members can view tasks" ON public.team_tasks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = team_tasks.team_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.guest_members WHERE team_id = team_tasks.team_id AND user_id = auth.uid())
  );

CREATE POLICY "Team members can modify tasks" ON public.team_tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = team_tasks.team_id AND user_id = auth.uid())
  );

-- Reviews: Viewable by all, insertable only once per collaboration
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can leave review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = author_id AND auth.uid() != target_user_id);

-- Opportunities & Hackathons: Public read
CREATE POLICY "Opportunities viewable by all" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Hackathons viewable by all" ON public.hackathons FOR SELECT USING (true);

-- Notifications: Only recipient can view/update
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
