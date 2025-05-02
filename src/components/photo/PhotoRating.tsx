
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PhotoRatingProps {
  photoId: string;
}

// Define proper response types for RPC functions
interface UserRatingResponse {
  rating: number;
}

interface PhotoRatingsResponse {
  rating: number;
}

// Create a custom hook for managing user identity
const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Try to get the user ID from localStorage
    let id = localStorage.getItem('photo_rating_user_id');
    
    // If no ID exists, create one and store it
    if (!id) {
      id = uuidv4();
      localStorage.setItem('photo_rating_user_id', id);
    }
    
    setUserId(id);
  }, []);
  
  return userId;
};

export const PhotoRating: React.FC<PhotoRatingProps> = ({ photoId }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useUserId();
  
  // Check if the user has already rated this photo
  const checkUserRating = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_photo_rating', { 
          photo_id_param: photoId,
          user_id_param: uid
        });
      
      if (error) {
        console.error("Error checking user rating:", error);
        return;
      }
      
      if (data && Array.isArray(data) && data.length > 0) {
        setUserRating(data[0]?.rating);
      }
    } catch (error) {
      console.error("Error checking user rating:", error);
    }
  };
  
  // Fetch average rating for this photo
  const fetchAverageRating = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_photo_ratings', { 
          photo_id_param: photoId 
        });
      
      if (error) {
        console.error("Error fetching ratings:", error);
        return;
      }
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Calculate average rating
        const sum = data.reduce((acc: number, curr: PhotoRatingsResponse) => acc + curr.rating, 0);
        setAverageRating(parseFloat((sum / data.length).toFixed(1)));
        setTotalRatings(data.length);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };
  
  // Submit or update a rating
  const submitRating = async (rating: number, uid: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .rpc('add_photo_rating', {
          photo_id_param: photoId,
          user_id_param: uid,
          rating_param: rating
        });
      
      if (error) {
        console.error("Error submitting rating:", error);
        toast.error("Failed to submit rating");
        return;
      }
      
      setUserRating(rating);
      fetchAverageRating(); // Refresh the average
      toast.success("Rating submitted successfully");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      checkUserRating(userId);
    }
  }, [userId, photoId]);
  
  useEffect(() => {
    fetchAverageRating();
  }, [photoId]);
  
  return (
    <div className="pt-2 pb-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Rating</h3>
          {averageRating !== null && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-yellow-400">{averageRating}</span>
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-400">({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={cn(
                "focus:outline-none transition-all duration-200 transform",
                (hoverRating !== null && star <= hoverRating) || (hoverRating === null && userRating !== null && star <= userRating)
                  ? "text-yellow-400 hover:scale-110" 
                  : "text-gray-400 hover:text-yellow-200",
                isSubmitting ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              )}
              onClick={() => userId && submitRating(star, userId)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              disabled={isSubmitting}
            >
              <Star 
                size={24} 
                className={cn(
                  "transition-all duration-200",
                  (hoverRating !== null && star <= hoverRating) || (hoverRating === null && userRating !== null && star <= userRating)
                    ? "fill-yellow-400"
                    : ""
                )}
              />
            </button>
          ))}
          {!userId ? (
            <span className="text-xs text-gray-400 ml-2">Loading...</span>
          ) : userRating ? (
            <span className="text-xs text-gray-400 ml-2">You rated {userRating} {userRating === 1 ? 'star' : 'stars'}</span>
          ) : (
            <span className="text-xs text-gray-400 ml-2">Rate this photo</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoRating;
