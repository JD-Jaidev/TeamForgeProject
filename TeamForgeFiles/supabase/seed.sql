-- TeamForge Production Seed Data
-- Run after 20260917000001_initial_schema.sql

-- Insert Skills
INSERT INTO public.skills (name, category) VALUES
  ('Python', 'Programming Language'),
  ('PyTorch', 'Machine Learning'),
  ('NLP', 'Artificial Intelligence'),
  ('FastAPI', 'Backend'),
  ('React', 'Frontend'),
  ('TypeScript', 'Programming Language'),
  ('Vue.js', 'Frontend'),
  ('Tailwind CSS', 'Design & CSS'),
  ('Three.js', '3D Graphics'),
  ('UI/UX Design', 'Design'),
  ('Go', 'Programming Language'),
  ('Rust', 'Systems'),
  ('PostgreSQL', 'Database'),
  ('Supabase', 'Platform'),
  ('Solidity', 'Blockchain'),
  ('Hardhat', 'Web3'),
  ('Flutter', 'Mobile'),
  ('OpenCV', 'Computer Vision')
ON CONFLICT (name) DO NOTHING;

-- Insert Mock Hackathons
INSERT INTO public.hackathons (title, organizer, description, dates, deadline, prize, tags, location, mode, registration_link) VALUES
  (
    'Global AI & Agentic Hackathon 2026',
    'DeepMind & OpenSource AI Foundation',
    'Build groundbreaking multi-agent systems, multimodal neural interfaces, and autonomous assistant workflows.',
    'Oct 10 - Oct 12, 2026',
    'Oct 05, 2026',
    '$100,000 in Prizes & GPU Grants',
    ARRAY['Artificial Intelligence', 'Autonomous Agents', 'PyTorch', 'NLP'],
    'Virtual / Global',
    'Online',
    'https://hackathon.example.org/global-ai-2026'
  ),
  (
    'MIT Climate & Sustainable Tech Sprint',
    'MIT Energy Initiative',
    'Develop software solutions for carbon footprint auditing, decentralized energy grids, and circular economy tracking.',
    'Nov 02 - Nov 06, 2026',
    'Oct 25, 2026',
    '$50,000 + Venture Incubator Fast-Track',
    ARRAY['Climate Tech', 'Clean Energy', 'Web3', 'IoT'],
    'Cambridge, MA & Hybrid',
    'Hybrid',
    'https://climate.mit.edu/sprint2026'
  ),
  (
    'RoboHack World 2026',
    'IEEE Robotics & Automation Society',
    'Autonomous drone navigation, computer vision challenges, and industrial robotics inspection algorithms.',
    'Nov 18 - Nov 20, 2026',
    'Nov 10, 2026',
    '$75,000 Robotics Hardware Grants',
    ARRAY['Robotics', 'Computer Vision', 'ROS2', 'C++', 'Edge AI'],
    'San Francisco, CA & Online',
    'Hybrid',
    'https://roboworld.example.com'
  );
