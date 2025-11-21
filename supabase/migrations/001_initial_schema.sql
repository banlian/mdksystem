-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- IO Configurations table
CREATE TABLE public.io_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('DI', 'DO', 'AI', 'AO', 'SIGNAL')),
  address TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Axis Configurations table
CREATE TABLE public.axis_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('X', 'Y', 'Z', 'A', 'B', 'C')),
  max_speed DECIMAL(10,3) NOT NULL,
  acceleration DECIMAL(10,3) NOT NULL,
  deceleration DECIMAL(10,3) NOT NULL,
  home_position DECIMAL(10,3) NOT NULL,
  soft_limit_min DECIMAL(10,3) NOT NULL,
  soft_limit_max DECIMAL(10,3) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Station Configurations table
CREATE TABLE public.station_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  position_x DECIMAL(10,3) NOT NULL DEFAULT 0,
  position_y DECIMAL(10,3) NOT NULL DEFAULT 0,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Station-IO junction table
CREATE TABLE public.station_io_configs (
  station_id UUID REFERENCES public.station_configs(id) ON DELETE CASCADE,
  io_config_id UUID REFERENCES public.io_configs(id) ON DELETE CASCADE,
  PRIMARY KEY (station_id, io_config_id)
);

-- Station-Axis junction table
CREATE TABLE public.station_axis_configs (
  station_id UUID REFERENCES public.station_configs(id) ON DELETE CASCADE,
  axis_config_id UUID REFERENCES public.axis_configs(id) ON DELETE CASCADE,
  PRIMARY KEY (station_id, axis_config_id)
);

-- Task Configurations table
CREATE TABLE public.task_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  station_id UUID REFERENCES public.station_configs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Task Steps table
CREATE TABLE public.task_steps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.task_configs(id) ON DELETE CASCADE NOT NULL,
  sequence_order INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('MOVE', 'IO', 'WAIT', 'CONDITION')),
  parameters JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_io_configs_project_id ON public.io_configs(project_id);
CREATE INDEX idx_axis_configs_project_id ON public.axis_configs(project_id);
CREATE INDEX idx_station_configs_project_id ON public.station_configs(project_id);
CREATE INDEX idx_task_configs_project_id ON public.task_configs(project_id);
CREATE INDEX idx_task_configs_station_id ON public.task_configs(station_id);
CREATE INDEX idx_task_steps_task_id ON public.task_steps(task_id);
CREATE INDEX idx_task_steps_sequence ON public.task_steps(task_id, sequence_order);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.io_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.axis_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_io_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_axis_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- IO Configs policies
CREATE POLICY "Users can view own io configs" ON public.io_configs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own io configs" ON public.io_configs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);

-- Axis Configs policies
CREATE POLICY "Users can view own axis configs" ON public.axis_configs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own axis configs" ON public.axis_configs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);

-- Station Configs policies
CREATE POLICY "Users can view own station configs" ON public.station_configs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own station configs" ON public.station_configs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);

-- Junction tables policies
CREATE POLICY "Users can manage own station io configs" ON public.station_io_configs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.station_configs WHERE id = station_id AND
         EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()))
);

CREATE POLICY "Users can manage own station axis configs" ON public.station_axis_configs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.station_configs WHERE id = station_id AND
         EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()))
);

-- Task Configs policies
CREATE POLICY "Users can view own task configs" ON public.task_configs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own task configs" ON public.task_configs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);

-- Task Steps policies
CREATE POLICY "Users can view own task steps" ON public.task_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.task_configs WHERE id = task_id AND
         EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()))
);
CREATE POLICY "Users can manage own task steps" ON public.task_steps FOR ALL USING (
  EXISTS (SELECT 1 FROM public.task_configs WHERE id = task_id AND
         EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()))
);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_io_configs_updated_at BEFORE UPDATE ON public.io_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_axis_configs_updated_at BEFORE UPDATE ON public.axis_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_station_configs_updated_at BEFORE UPDATE ON public.station_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_configs_updated_at BEFORE UPDATE ON public.task_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_steps_updated_at BEFORE UPDATE ON public.task_steps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();