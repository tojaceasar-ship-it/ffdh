-- FFDH Rewir AI Scene Schema Extension
-- Extends existing scenes table with Rewir AI specific fields

-- Add new columns to scenes table for Rewir AI integration
ALTER TABLE public.scenes
  ADD COLUMN IF NOT EXISTS sanity_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS narrative TEXT,
  ADD COLUMN IF NOT EXISTS emotion_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- Create index on sanity_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_scenes_sanity_id ON public.scenes(sanity_id);

-- Create index on emotion_tags for filtering
CREATE INDEX IF NOT EXISTS idx_scenes_emotion_tags ON public.scenes USING GIN(emotion_tags);

-- Create index on slug for faster scene lookups
CREATE INDEX IF NOT EXISTS idx_scenes_slug ON public.scenes(slug);

-- Create index on view_count for sorting popular scenes
CREATE INDEX IF NOT EXISTS idx_scenes_view_count ON public.scenes(view_count DESC);

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_scene_view_count(scene_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.scenes
  SET view_count = view_count + 1
  WHERE slug = scene_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update comment count
CREATE OR REPLACE FUNCTION public.update_scene_comment_count(scene_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.scenes
  SET comment_count = (
    SELECT COUNT(*)::INTEGER
    FROM public.comments
    WHERE comments.scene_id = scene_id
      AND comments.is_approved = true
  )
  WHERE id = scene_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create scene_comments junction table (if not exists in comments table structure)
-- Add scene_id column to comments if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'comments'
      AND column_name = 'scene_id'
  ) THEN
    ALTER TABLE public.comments
      ADD COLUMN scene_id UUID REFERENCES public.scenes(id) ON DELETE CASCADE,
      ADD COLUMN emotion TEXT,
      ADD COLUMN ai_response TEXT,
      ADD COLUMN ai_response_emotion TEXT;
    
    CREATE INDEX IF NOT EXISTS idx_comments_scene_id ON public.comments(scene_id);
  END IF;
END $$;

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION public.increment_scene_view_count(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_scene_comment_count(UUID) TO anon, authenticated;

