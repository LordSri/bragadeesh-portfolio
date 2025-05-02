
import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PhotoRatingProps {
  photoId: string;
}

// Define proper response types for RPC functions
interface RatingData {
  rating: number;
}

interface UserRatingResponse {
  data?: RatingData[];
  error?: Error;
}

interface PhotoRatingsResponse {
  data?: { ratings: RatingData[] }[];
  error?: Error;
}

const PhotoRating: React.FC<PhotoRatingProps> = ({ photoId }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        checkUserRating(user.id);
      }
    };
    
    fetchUser();
    fetchAverageRating();
  }, [photoId]);

  /**
   * Check if the current user has rated this photo
   */
  const checkUserRating = async (uid: string) => {
    try {
      const { data, error }: UserRatingResponse = await supabase
        .rpc('get_user_photo_rating', { 
          photo_id_param: photoId,
          user_id_param: uid
        });
      
      if (error) {
        console.error('Error fetching user rating:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setUserRating(data[0]?.rating || null);
      }
    } catch (err) {
      console.error('Error in checkUserRating:', err);
    }
  };

  /**
   * Fetch the average rating for this photo
   */
  const fetchAverageRating = async () => {
    try {
      const { data, error }: PhotoRatingsResponse = await supabase
        .rpc('get_photo_ratings', { 
          photo_id_param: photoId
        });
      
      if (error) {
        console.error('Error fetching ratings:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const ratings = data[0]?.ratings || [];
        if (ratings && ratings.length > 0) {
          const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
          const average = sum / ratings.length;
          setAverageRating(parseFloat(average.toFixed(1)));
          setRatingCount(ratings.length);
        }
      }
    } catch (err) {
      console.error('Error in fetchAverageRating:', err);
    }
  };

  /**
   * Save the user's rating
   */
  const saveRating = async (rating: number) => {
    if (!userId) {
      toast.error('You must be logged in to rate photos');
      return;
    }

    try {
      const { error } = await supabase
        .rpc('set_photo_rating', { 
          photo_id_param: photoId,
          user_id_param: userId,
          rating_param: rating 
        });

      if (error) {
        console.error('Error saving rating:', error);
        toast.error('Failed to save rating');
        return;
      }

      setUserRating(rating);
      toast.success('Rating saved');
      fetchAverageRating();
    } catch (err) {
      console.error('Error in saveRating:', err);
      toast.error('Failed to save rating');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-1">
        {/* Average rating display */}
        <div className="flex mr-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={`avg-${star}`}
              size={18}
              className={cn(
                "text-gray-500",
                { "text-yellow-400 fill-yellow-400": averageRating && star <= averageRating }
              )}
            />
          ))}
        </div>
        <span className="text-sm">
          {averageRating ? `${averageRating} (${ratingCount} ${ratingCount === 1 ? 'rating' : 'ratings'})` : 'No ratings yet'}
        </span>
      </div>

      {/* User rating interface */}
      <div className="flex items-center">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={`user-${star}`}
              size={24}
              className={cn(
                "cursor-pointer transition-colors",
                { 
                  "text-yellow-400 fill-yellow-400": 
                    (hoveredStar !== null && star <= hoveredStar) || 
                    (hoveredStar === null && userRating !== null && star <= userRating)
                },
                { "text-gray-400": hoveredStar === null && (userRating === null || star > userRating) }
              )}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => saveRating(star)}
            />
          ))}
        </div>
        <span className="ml-2 text-sm">
          {userRating ? 'Your rating' : 'Rate this photo'}
        </span>
      </div>
    </div>
  );
};

export default PhotoRating;
