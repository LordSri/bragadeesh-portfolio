
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
      
      // Check if user has already rated this photo
      const { data: existingRating } = await supabase
        .from('photo_ratings')
        .select('rating')
        .eq('photo_id', photoId)
        .eq('user_id', userId)
        .single();
      
      if (existingRating) {
        setRating(existingRating.rating);
        setHasRated(true);
      }
      
      // Fetch average rating
      fetchAverageRating();
    };
    
    checkUserRating();
  }, [photoId]);
  
  // Fetch average rating for the photo
  const fetchAverageRating = async () => {
    const { data, error } = await supabase
      .from('photo_ratings')
      .select('rating')
      .eq('photo_id', photoId);
      
    if (error) {
      console.error('Error fetching ratings:', error);
      return;
    }
    
    if (data && data.length > 0) {
      const total = data.reduce((sum, item) => sum + item.rating, 0);
      setAverageRating(total / data.length);
      setRatingCount(data.length);
    }
  };
  
  // Submit user rating
  const handleRatingClick = async (value: number) => {
    if (hasRated) return;
    
    const userId = generateUniqueId();
    
    // Insert rating
    const { error } = await supabase
      .from('photo_ratings')
      .insert({
        photo_id: photoId,
        user_id: userId,
        rating: value
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
