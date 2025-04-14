
import React, { useState, useEffect, useRef } from 'react';
import { Award, ChevronRight, ChevronLeft, X, Calendar, Clock, MapPin, Camera, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Photo {
  id: number;
  src: string;
  title: string;
  description: string;
  award?: string;
  aspectRatio: string;
  exif?: {
    camera?: string;
    date?: string;
    location?: string;
    exposure?: string;
  };
  beforeAfter?: {
    before: string;
    after: string;
  };
}

const photos: Photo[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    title: "Northern Lights",
    description: "Aurora Borealis captured in Norway",
    award: "Nature Photography Award 2023",
    aspectRatio: "4/3",
    exif: {
      camera: "Canon EOS 5D Mark IV",
      date: "January 15, 2023",
      location: "Tromsø, Norway",
      exposure: "30s, f/2.8, ISO 1600"
    },
    beforeAfter: {
      before: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=75&auto=format&fit=crop&w=1000",
      after: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=100&auto=format&fit=crop&w=1000&sat=50"
    }
  },
  {
    id: 2, 
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "Mountain Lake",
    description: "Serene lake surrounded by mountains",
    aspectRatio: "16/9",
    exif: {
      camera: "Nikon Z7",
      date: "June 22, 2023",
      location: "Banff National Park, Canada",
      exposure: "1/125s, f/11, ISO 100"
    }
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    title: "Forest Path",
    description: "Mystical path through the woods",
    aspectRatio: "3/4",
    exif: {
      camera: "Sony A7R IV",
      date: "October 5, 2022",
      location: "Redwood Forest, California",
      exposure: "1/60s, f/4, ISO 400"
    }
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    title: "Whale Breach",
    description: "Humpback whale breaching the surface",
    award: "Wildlife Photographer of the Year",
    aspectRatio: "16/9",
    exif: {
      camera: "Canon EOS R5",
      date: "July 30, 2023",
      location: "Maui, Hawaii",
      exposure: "1/2000s, f/8, ISO 800"
    },
    beforeAfter: {
      before: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?q=75&auto=format&fit=crop&w=1000",
      after: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?q=100&auto=format&fit=crop&w=1000&sat=50"
    }
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    title: "Digital Display",
    description: "Modern digital screen installation",
    aspectRatio: "1/1",
    exif: {
      camera: "Fujifilm X-T4",
      date: "December 3, 2023",
      location: "Tokyo, Japan",
      exposure: "1/30s, f/2.0, ISO 1600"
    }
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    title: "Code Canvas",
    description: "Colorful lines of code",
    aspectRatio: "4/3",
    exif: {
      camera: "iPhone 14 Pro",
      date: "February 17, 2023",
      location: "San Francisco, USA",
      exposure: "1/60s, f/1.8, ISO 250"
    }
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac",
    title: "Wildlife Portrait",
    description: "Brown cattle in natural habitat",
    aspectRatio: "3/2",
    exif: {
      camera: "Nikon D850",
      date: "April 10, 2023",
      location: "Yellowstone National Park, USA",
      exposure: "1/500s, f/4, ISO 400"
    }
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    title: "Mountain Vista",
    description: "Bird's eye view of green mountains",
    aspectRatio: "16/9",
    exif: {
      camera: "DJI Mavic 3",
      date: "May 28, 2023",
      location: "Swiss Alps",
      exposure: "1/240s, f/5.6, ISO 100"
    }
  }
];

const PhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [beforeAfterSlider, setBeforeAfterSlider] = useState(50);
  const [userPhotos, setUserPhotos] = useState<File[]>([]);
  const [userPhotoUrls, setUserPhotoUrls] = useState<string[]>([]);
  const [userPhotoObjects, setUserPhotoObjects] = useState<Photo[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  
  // Create ref for scrolling to thumbnail
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Combine all photos
    setAllPhotos([...userPhotoObjects, ...photos]);
  }, [userPhotoObjects]);
  
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setBeforeAfterSlider(50);
    
    // Scroll to the thumbnail after a short delay
    setTimeout(() => {
      if (thumbnailsRef.current) {
        const thumbnailElement = document.getElementById(`thumbnail-${photo.id}`);
        if (thumbnailElement) {
          thumbnailsRef.current.scrollTo({
            left: thumbnailElement.offsetLeft - thumbnailsRef.current.clientWidth / 2 + thumbnailElement.clientWidth / 2,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
  };
  
  const closeModal = () => {
    setSelectedPhoto(null);
  };
  
  const navigateGallery = (direction: 'next' | 'prev') => {
    if (!selectedPhoto || allPhotos.length === 0) return;
    
    const currentIndex = allPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === allPhotos.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? allPhotos.length - 1 : currentIndex - 1;
    }
    
    setSelectedPhoto(allPhotos[newIndex]);
    setBeforeAfterSlider(50);
    
    // Scroll to the new thumbnail
    setTimeout(() => {
      if (thumbnailsRef.current) {
        const thumbnailElement = document.getElementById(`thumbnail-${allPhotos[newIndex].id}`);
        if (thumbnailElement) {
          thumbnailsRef.current.scrollTo({
            left: thumbnailElement.offsetLeft - thumbnailsRef.current.clientWidth / 2 + thumbnailElement.clientWidth / 2,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setUserPhotos(prev => [...prev, ...newFiles]);
      setUserPhotoUrls(prev => [...prev, ...newUrls]);
      
      // Create Photo objects for user uploads
      const newPhotoObjects = newFiles.map((file, index) => {
        const lastId = userPhotoObjects.length > 0 
          ? userPhotoObjects[userPhotoObjects.length - 1].id 
          : (photos.length > 0 ? photos[photos.length - 1].id : 0);
        
        return {
          id: lastId + index + 1,
          src: newUrls[index],
          title: `User Photo ${userPhotoObjects.length + index + 1}`,
          description: file.name,
          aspectRatio: "auto", // Will maintain original aspect ratio
          exif: {
            date: new Date().toLocaleDateString()
          }
        };
      });
      
      setUserPhotoObjects(prev => [...prev, ...newPhotoObjects]);
      toast.success(`${newFiles.length} photo(s) uploaded successfully`);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      userPhotoUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [userPhotoUrls]);
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPhoto]);
  
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
  }, [selectedPhoto, navigateGallery]);
  
  return (
    <div className="w-full">
      {/* For development only - temporary photo uploader */}
      <div className="mb-8 p-4 glass-panel rounded-xl border border-dashed border-red-500/20">
        <h3 className="text-lg font-medium mb-2">Temporary Photo Uploader</h3>
        <p className="text-sm text-gray-400 mb-4">
          This uploader is for development purposes only. Upload photos to preview how they'll appear in the gallery.
        </p>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => document.getElementById('photo-upload')?.click()}
            variant="outline"
            className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border-red-500/40"
          >
            <Upload size={16} />
            <span>Select Photos</span>
          </Button>
          <input 
            id="photo-upload" 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="hidden"
          />
          {userPhotos.length > 0 && (
            <span className="text-sm text-gray-300">{userPhotos.length} photo(s) selected</span>
          )}
        </div>
        {userPhotoUrls.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {userPhotoUrls.map((url, index) => (
              <div key={index} className="w-16 h-16 rounded-md overflow-hidden">
                <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
        {/* Show all photos (user uploaded + sample) */}
        {allPhotos.map((photo) => (
          <div 
            key={photo.id}
            className={cn(
              "overflow-hidden rounded-xl shadow-lg group cursor-pointer transition-transform duration-300 hover:scale-[1.01]",
              photo.aspectRatio === "3/4" && "row-span-2",
              (photo.aspectRatio === "16/9" || photo.aspectRatio === "3/2") && "sm:col-span-2"
            )}
            onClick={() => handlePhotoClick(photo)}
          >
            <div className="relative w-full h-full">
              <img 
                src={photo.src} 
                alt={photo.title} 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white text-lg font-medium">{photo.title}</h3>
                {photo.award && (
                  <div className="flex items-center mt-1">
                    <Award size={16} className="text-red-500 mr-1" />
                    <span className="text-xs text-gray-300">{photo.award}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal with thumbnail navigation */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-lg animate-fade-in">
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={closeModal} 
              className="h-10 w-10 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500/40 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="relative flex-1 w-full flex items-center justify-center p-4 overflow-hidden">
            {/* Main Image */}
            <div className="max-h-[70vh] max-w-full overflow-hidden flex items-center justify-center">
              {selectedPhoto.beforeAfter ? (
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={selectedPhoto.beforeAfter.before} 
                      alt="Before" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div 
                    className="absolute inset-0 overflow-hidden" 
                    style={{ clipPath: `inset(0 0 0 ${beforeAfterSlider}%)` }}
                  >
                    <img 
                      src={selectedPhoto.beforeAfter.after} 
                      alt="After" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center">
                    <div 
                      className="relative w-full"
                      style={{ touchAction: 'none' }}
                    >
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={beforeAfterSlider} 
                        onChange={(e) => setBeforeAfterSlider(parseInt(e.target.value))} 
                        className="w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
                      />
                      <div 
                        className="absolute top-1/2 w-0.5 h-full bg-white pointer-events-none transform -translate-y-1/2" 
                        style={{ left: `${beforeAfterSlider}%` }}
                      />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 glass-panel p-2 px-3 rounded-full text-xs font-medium">
                    Before / After
                  </div>
                </div>
              ) : (
                <img 
                  src={selectedPhoto.src} 
                  alt={selectedPhoto.title} 
                  className="max-w-full max-h-[70vh] object-contain"
                />
              )}
            </div>
            
            {/* Navigation arrows */}
            <button 
              onClick={() => navigateGallery('prev')} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full glass-panel backdrop-blur-md flex items-center justify-center hover:bg-red-500/20 transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => navigateGallery('next')} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full glass-panel backdrop-blur-md flex items-center justify-center hover:bg-red-500/20 transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          </div>
          
          {/* Photo Info */}
          <div className="mt-4 px-4 max-w-3xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-1">{selectedPhoto.title}</h2>
                <p className="text-gray-300 text-sm">{selectedPhoto.description}</p>
              </div>
              
              {selectedPhoto.award && (
                <div className="flex items-center p-2 glass-panel rounded-lg">
                  <Award size={16} className="text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-xs">{selectedPhoto.award}</span>
                </div>
              )}
            </div>
            
            {selectedPhoto.exif && (
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                {selectedPhoto.exif.camera && (
                  <div className="flex items-center">
                    <Camera size={14} className="text-red-500 mr-1 flex-shrink-0" />
                    <span>{selectedPhoto.exif.camera}</span>
                  </div>
                )}
                {selectedPhoto.exif.date && (
                  <div className="flex items-center">
                    <Calendar size={14} className="text-red-500 mr-1 flex-shrink-0" />
                    <span>{selectedPhoto.exif.date}</span>
                  </div>
                )}
                {selectedPhoto.exif.location && (
                  <div className="flex items-center">
                    <MapPin size={14} className="text-red-500 mr-1 flex-shrink-0" />
                    <span>{selectedPhoto.exif.location}</span>
                  </div>
                )}
                {selectedPhoto.exif.exposure && (
                  <div className="flex items-center">
                    <Clock size={14} className="text-red-500 mr-1 flex-shrink-0" />
                    <span>{selectedPhoto.exif.exposure}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Thumbnail Navigation */}
          <div 
            ref={thumbnailsRef}
            className="w-full mt-4 pb-4 px-4 overflow-x-auto scrollbar-hide"
          >
            <div className="flex space-x-2 min-w-max px-4">
              {allPhotos.map((photo) => (
                <button
                  key={`thumbnail-${photo.id}`}
                  id={`thumbnail-${photo.id}`}
                  onClick={() => handlePhotoClick(photo)}
                  className={cn(
                    "relative transition-all duration-200 flex-shrink-0 rounded-md overflow-hidden border-2",
                    selectedPhoto.id === photo.id 
                      ? "border-red-500 opacity-100 transform scale-105" 
                      : "border-transparent opacity-70 grayscale hover:opacity-90 hover:grayscale-0"
                  )}
                  style={{ width: '80px', height: '60px' }}
                >
                  <img 
                    src={photo.src} 
                    alt={photo.title} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
