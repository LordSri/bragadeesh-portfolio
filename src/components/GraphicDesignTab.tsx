
import React, { useState, useEffect } from 'react';
import { fetchPhotoMetadata, Photo } from '@/utils/photoUtils';
import GraphicDesignUploader from '@/components/graphic-design/GraphicDesignUploader';
import GraphicDesignGrid from '@/components/graphic-design/GraphicDesignGrid';
import GraphicDesignModal from '@/components/graphic-design/GraphicDesignModal';

const GraphicDesignTab: React.FC = () => {
  const [designs, setDesigns] = useState<Photo[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch designs from Supabase
  const loadDesigns = async () => {
    setLoading(true);
    const fetchedPhotos = await fetchPhotoMetadata('design');
    setDesigns(fetchedPhotos);
    setLoading(false);
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  // Handle design selection for modal view
  const handleDesignClick = (design: Photo) => {
    setSelectedDesign(design);
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setSelectedDesign(null);
    document.body.style.overflow = '';
  };
  
  const navigateGallery = (direction: 'next' | 'prev') => {
    if (!selectedDesign || designs.length === 0) return;
    
    const currentIndex = designs.findIndex(p => p.id === selectedDesign.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === designs.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? designs.length - 1 : currentIndex - 1;
    }
    
    setSelectedDesign(designs[newIndex]);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedDesign) {
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
  }, [selectedDesign, designs]);
  
  return (
    <div className="w-full">
      {/* Design Uploader */}
      <GraphicDesignUploader onDesignUploaded={loadDesigns} />
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Design Grid */}
      {!loading && designs.length > 0 && (
        <GraphicDesignGrid designs={designs} onDesignClick={handleDesignClick} />
      )}
      
      {/* Empty State */}
      {!loading && designs.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium mb-2">No designs yet</h3>
          <p className="text-gray-400">Upload designs to get started</p>
        </div>
      )}
      
      {/* Modal with selected design */}
      {selectedDesign && (
        <GraphicDesignModal 
          design={selectedDesign} 
          designs={designs}
          onClose={closeModal} 
          onNavigate={navigateGallery}
          onDesignUpdated={loadDesigns}
        />
      )}
    </div>
  );
};

export default GraphicDesignTab;
