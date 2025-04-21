
-- Create a table to store photo ratings
CREATE TABLE IF NOT EXISTS public.photo_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL REFERENCES public.photo_metadata(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- This will store the client-generated ID
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure users can only rate once per photo
  UNIQUE(photo_id, user_id)
);

-- Add RLS policies
ALTER TABLE public.photo_ratings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to select ratings
CREATE POLICY "Anyone can view ratings" 
ON public.photo_ratings
FOR SELECT 
TO public
USING (true);

-- Allow authenticated users to insert their own ratings
CREATE POLICY "Anyone can insert ratings" 
ON public.photo_ratings
FOR INSERT 
TO public
WITH CHECK (true);

-- No one can update or delete ratings directly
