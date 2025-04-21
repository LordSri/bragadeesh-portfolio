import React, { useState, useEffect } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface PhotoRatingProps {
  photoId: string;
  showAverage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PhotoRating: React.FC<PhotoRatingProps> = ({
  photoId,
  showAverage = true,
  size = 'md',
  className
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const { toast } = useToast();
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };
  
  // Generate a unique identifier for this user/browser
  const generateUniqueId = () => {
    let id = localStorage.getItem('user_rating_id');
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_rating_id', id);
    }
    return id;
  };
  
  // Check if user has already rated this photo
  useEffect(() => {
    const checkUserRating = async () => {
      const userId = generateUniqueId();
      
      try {
        // Check if user has already rated this photo
        const { data: existingRating, error: ratingError } = await supabase
          .rpc('get_user_photo_rating', { photo_id_param: photoId, user_id_param: userId });
        
        if (ratingError) {
          console.error('Error checking user rating:', ratingError);
        } else if (existingRating) {
          setRating(existingRating.rating);
          setHasRated(true);
        }
        
        // Fetch average rating
        fetchAverageRating();
      } catch (error) {
        console.error('Error in checkUserRating:', error);
      }
    };
    
    checkUserRating();
  }, [photoId]);
  
  // Fetch average rating for the photo
  const fetchAverageRating = async () => {
    try {
      // Create a custom RPC call to get ratings for a specific photo
      const { data, error } = await supabase
        .rpc('get_photo_ratings', { photo_id_param: photoId });
        
      if (error) {
        console.error('Error fetching ratings:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const ratings = data.map(item => item.rating);
        const total = ratings.reduce((sum, rating) => sum + rating, 0);
        setAverageRating(total / ratings.length);
        setRatingCount(ratings.length);
      }
    } catch (error) {
      console.error('Error in fetchAverageRating:', error);
    }
  };
  
  // Submit user rating
  const handleRatingClick = async (value: number) => {
    if (hasRated) return;
    
    const userId = generateUniqueId();
    
    try {
      // Insert rating using a custom RPC function
      const { error } = await supabase
        .rpc('add_photo_rating', { 
          photo_id_param: photoId,
          user_id_param: userId,
          rating_param: value
        });
        
      if (error) {
        console.error('Error submitting rating:', error);
        toast({
          title: "Rating failed",
          description: "Unable to submit your rating. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      setRating(value);
      setHasRated(true);
      
      toast({
        title: "Rating submitted",
        description: "Thank you for rating this photo!",
      });
      
      // Update average rating
      fetchAverageRating();
    } catch (error) {
      console.error('Error in handleRatingClick:', error);
    }
  };
  
  // Render stars with the provided rating
  const renderStars = (ratingValue: number | null, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const activeValue = hover !== null && interactive ? hover : ratingValue;
          
          // Determine if this star should be filled, half-filled, or empty
          let starType: 'filled' | 'half' | 'empty' = 'empty';
          if (activeValue !== null) {
            if (star <= Math.floor(activeValue)) {
              starType = 'filled';
            } else if (star === Math.ceil(activeValue) && activeValue % 1 >= 0.3) {
              starType = 'half';
            }
          }
          
          return (
            <div
              key={star}
              className={cn(
                "cursor-pointer transition-transform",
                interactive && !hasRated ? "hover:scale-110" : "",
                hasRated ? "cursor-default" : ""
              )}
              onClick={() => interactive && !hasRated && handleRatingClick(star)}
              onMouseEnter={() => interactive && !hasRated && setHover(star)}
              onMouseLeave={() => interactive && !hasRated && setHover(null)}
            >
              {starType === 'filled' ? (
                <Star 
                  fill="#fc3a57" 
                  size={iconSizes[size]} 
                  className={cn("text-aurora-red", hasRated ? "animate-pulse-slow" : "")} 
                />
              ) : starType === 'half' ? (
                <StarHalf 
                  fill="#fc3a57" 
                  size={iconSizes[size]} 
                  className="text-aurora-red" 
                />
              ) : (
                <Star 
                  size={iconSizes[size]} 
                  className="text-gray-500" 
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {/* User rating input */}
      {renderStars(rating, true)}
      
      {/* Show average rating if enabled and available */}
      {showAverage && averageRating !== null && (
        <div className="flex items-center gap-2 mt-1">
          <div className="text-xs text-gray-400">
            {averageRating.toFixed(1)} ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoRating;
