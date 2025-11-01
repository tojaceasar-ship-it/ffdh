-- FFDH Seed Data
-- Sample data for development and testing

-- Seed initial data
SELECT public.seed_initial_data();

-- Insert sample admin user (for development)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@ffdh.local',
  crypt('admin123', gen_salt('bf')), -- Change in production!
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (
  id,
  email,
  name,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@ffdh.local',
  'Admin User',
  'admin'
) ON CONFLICT (id) DO NOTHING;

-- Insert more sample characters
INSERT INTO public.characters (name, slug, description, personality) VALUES
  (
    'Strawberry',
    'strawberry',
    'Sweet but fierce berry with street cred',
    '{"energy": 8, "coolness": 7, "loyalty": 9}'::jsonb
  ),
  (
    'Watermelon',
    'watermelon',
    'Cool and refreshing fruit of the streets',
    '{"energy": 6, "coolness": 9, "loyalty": 7}'::jsonb
  ),
  (
    'Grape',
    'grape',
    'Small but mighty, always rolling with the crew',
    '{"energy": 10, "coolness": 8, "loyalty": 10}'::jsonb
  ) ON CONFLICT (slug) DO NOTHING;

-- Insert sample scenes
INSERT INTO public.scenes (name, slug, description, character_id, ai_prompt, tags) VALUES
  (
    'The Drop',
    'the-drop',
    'When the crew drops a new collection',
    (SELECT id FROM public.characters WHERE slug = 'banana-man'),
    'Urban streetwear fashion show with neon lights and hip-hop energy',
    ARRAY['drop', 'fashion', 'urban', 'neon']
  ),
  (
    'Night Riders',
    'night-riders',
    'Late night adventures through the city',
    (SELECT id FROM public.characters WHERE slug = 'strawberry'),
    'Nocturnal cityscape with graffiti art and street lights',
    ARRAY['night', 'adventure', 'city']
  ) ON CONFLICT (slug) DO NOTHING;

-- Insert sample comments
INSERT INTO public.comments (author_id, author_name, content, is_approved) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Admin User',
    'Looking forward to the next drop!',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Admin User',
    'Banana Man is the best character!',
    true
  ) ON CONFLICT DO NOTHING;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Seed data insertion completed successfully';
END $$;

