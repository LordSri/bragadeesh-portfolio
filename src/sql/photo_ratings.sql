
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

-- Allow anyone to insert ratings
CREATE POLICY "Anyone can insert ratings" 
ON public.photo_ratings
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow users to update their own ratings
CREATE POLICY "Users can update their own ratings" 
ON public.photo_ratings
FOR UPDATE 
TO public
USING (user_id = current_setting('app.current_user_id', true)::text);

-- Allow users to delete their own ratings
CREATE POLICY "Users can delete their own ratings" 
ON public.photo_ratings
FOR DELETE 
TO public
USING (user_id = current_setting('app.current_user_id', true)::text);

-- Create functions for working with ratings
-- Function to get a user's rating for a specific photo
CREATE OR REPLACE FUNCTION public.get_user_photo_rating(
  photo_id_param UUID,
  user_id_param TEXT
)
RETURNS TABLE (rating INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT pr.rating
  FROM photo_ratings pr
  WHERE pr.photo_id = photo_id_param
  AND pr.user_id = user_id_param;
END;
$$;

-- Function to get all ratings for a specific photo
CREATE OR REPLACE FUNCTION public.get_photo_ratings(
  photo_id_param UUID
)
RETURNS TABLE (rating INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT pr.rating
  FROM photo_ratings pr
  WHERE pr.photo_id = photo_id_param;
END;
$$;

-- Function to add a new photo rating
CREATE OR REPLACE FUNCTION public.add_photo_rating(
  photo_id_param UUID,
  user_id_param TEXT,
  rating_param INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO photo_ratings (photo_id, user_id, rating)
  VALUES (photo_id_param, user_id_param, rating_param)
  ON CONFLICT (photo_id, user_id) 
  DO UPDATE SET rating = rating_param;
END;
$$;
