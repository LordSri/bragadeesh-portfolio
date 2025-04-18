
import React, { useState, useEffect } from 'react';
import PhotoUploader from '@/components/photo/PhotoUploader';
import PhotoGrid from '@/components/photo/PhotoGrid';
import PhotoModal from '@/components/photo/PhotoModal';
import PhotoThumbnailNav from '@/components/photo/PhotoThumbnailNav';
import { fetchPhotoMetadata, Photo } from '@/utils/photoUtils';

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch photos from Supabase
  const loadPhotos = async () => {
    setLoading(true);
    const fetchedPhotos = await fetchPhotoMetadata();
    setPhotos(fetchedPhotos);
    setLoading(false);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  // Handle photo selection for modal view
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = '';
  };
  
  const navigateGallery = (direction: 'next' | 'prev') => {
    if (!selectedPhoto || photos.length === 0) return;
    
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    }
    
    setSelectedPhoto(photos[newIndex]);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedPhoto) {
        if (event.key === 'ArrowRight') {
          navigateGallery('next');
        } else if (event.key === 'ArrowLeft') {
          navigateGallery('prev');
        } else if (event.key === 'Escape') {
          closeModal();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto, photos]);
  
  return (
    <div className="w-full">
      {/* Photo Uploader */}
      <PhotoUploader onPhotoUploaded={loadPhotos} />
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Photo Grid */}
      {!loading && photos.length > 0 && (
        <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
      )}
      
      {/* Empty State */}
      {!loading && photos.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium mb-2">No photos yet</h3>
          <p className="text-gray-400">Upload photos to get started</p>
        </div>
      )}
      
      {/* Modal with selected photo */}
      {selectedPhoto && (
        <>
          <PhotoModal 
            photo={selectedPhoto} 
            photos={photos}
            onClose={closeModal} 
            onNavigate={navigateGallery}
            onPhotoUpdated={loadPhotos}
            showDetails={true}
            hideDownload={true}
          />
          {/* Photo thumbnail navigation */}
          <PhotoThumbnailNav
            photos={photos}
            selectedPhoto={selectedPhoto}
            onThumbnailClick={(photo) => setSelectedPhoto(photo)}
          />
        </>
      )}
    </div>
  );
};

export default PhotoGallery;
