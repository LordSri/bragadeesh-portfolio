
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
