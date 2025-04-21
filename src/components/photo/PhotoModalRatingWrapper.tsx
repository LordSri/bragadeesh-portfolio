
import React from 'react';
import PhotoModal from './PhotoModal';
import PhotoRating from './PhotoRating';
import { Photo } from '@/utils/photoUtils';

interface PhotoModalRatingWrapperProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onPhotoUpdated?: () => Promise<void>;
  showDetails?: boolean;
  hideDownload?: boolean;
}

const PhotoModalRatingWrapper: React.FC<PhotoModalRatingWrapperProps> = (props) => {
  return (
    <>
      <PhotoModal {...props} />
      
      {/* Add rating component */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto glass-morphism rounded-lg p-3 animate-fade-in">
          <PhotoRating photoId={props.photo.id} size="lg" />
        </div>
      </div>
    </>
  );
};

export default PhotoModalRatingWrapper;
