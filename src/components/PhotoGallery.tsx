
import React, { useState, useEffect } from 'react';
import { Award, ChevronRight, ChevronLeft, X, Calendar, Clock, MapPin, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setBeforeAfterSlider(50);
  };
  
  const closeModal = () => {
    setSelectedPhoto(null);
  };
  
  const navigateGallery = (direction: 'next' | 'prev') => {
    if (!selectedPhoto) return;
    
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    }
    
    setSelectedPhoto(photos[newIndex]);
    setBeforeAfterSlider(50);
  };
  
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPhoto]);
  
  return (
    <div className="w-full">
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-2 md:gap-3"
        style={{ transform: `translateY(${scrollY * 0.02}px)` }}
      >
        {photos.map((photo) => (
          <div 
            key={photo.id}
            className={cn(
              "relative overflow-hidden rounded-xl aurora-border group cursor-pointer animate-fade-in",
              {
                "row-span-2": photo.aspectRatio === "3/4",
                "col-span-2": photo.aspectRatio === "16/9" || photo.aspectRatio === "3/2",
              }
            )}
            style={{ 
              aspectRatio: photo.aspectRatio,
              transform: `translateY(${scrollY * 0.03 * (photo.id % 3)}px)`
            }}
            onClick={() => handlePhotoClick(photo)}
          >
            <img 
              src={photo.src} 
              alt={photo.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cosmic/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <h3 className="text-white text-lg font-medium">{photo.title}</h3>
              {photo.award && (
                <div className="flex items-center mt-1">
                  <Award size={16} className="text-aurora-red mr-1" />
                  <span className="text-xs text-gray-300">{photo.award}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cosmic/90 backdrop-blur-md animate-fade-in">
          <div className="glass-panel rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-cosmic/50 flex items-center justify-center text-white hover:bg-aurora-red/50 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col lg:flex-row h-full">
              <div className="relative flex-1 min-h-[300px] bg-cosmic-dark flex items-center justify-center">
                {selectedPhoto.beforeAfter ? (
                  <div className="relative w-full h-full max-h-[70vh]">
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
                          className="w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-aurora-red"
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
                    className="w-full h-full object-contain max-h-[70vh]"
                  />
                )}
                
                {/* Navigation arrows */}
                <button 
                  onClick={() => navigateGallery('prev')} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full glass-panel flex items-center justify-center hover:bg-aurora-red/20 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => navigateGallery('next')} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full glass-panel flex items-center justify-center hover:bg-aurora-red/20 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              
              <div className="p-6 flex-shrink-0 w-full lg:w-96 bg-cosmic-dark/50">
                <h2 className="text-xl font-bold mb-2">{selectedPhoto.title}</h2>
                <p className="text-gray-300 mb-4">{selectedPhoto.description}</p>
                
                {selectedPhoto.award && (
                  <div className="flex items-center p-3 mb-4 glass-panel rounded-lg">
                    <Award size={20} className="text-aurora-red mr-3 flex-shrink-0" />
                    <div>
                      <span className="block text-xs text-gray-400">Award Winner</span>
                      <span className="text-sm font-medium">{selectedPhoto.award}</span>
                    </div>
                  </div>
                )}
                
                {selectedPhoto.exif && (
                  <div className="space-y-2 my-4">
                    <h3 className="text-sm font-semibold text-gray-300">EXIF Data</h3>
                    <div className="glass-panel rounded-lg p-3 space-y-3">
                      {selectedPhoto.exif.camera && (
                        <div className="flex items-center">
                          <Camera size={16} className="text-aurora-red mr-2 flex-shrink-0" />
                          <span className="text-sm">{selectedPhoto.exif.camera}</span>
                        </div>
                      )}
                      {selectedPhoto.exif.date && (
                        <div className="flex items-center">
                          <Calendar size={16} className="text-aurora-red mr-2 flex-shrink-0" />
                          <span className="text-sm">{selectedPhoto.exif.date}</span>
                        </div>
                      )}
                      {selectedPhoto.exif.location && (
                        <div className="flex items-center">
                          <MapPin size={16} className="text-aurora-red mr-2 flex-shrink-0" />
                          <span className="text-sm">{selectedPhoto.exif.location}</span>
                        </div>
                      )}
                      {selectedPhoto.exif.exposure && (
                        <div className="flex items-center">
                          <Clock size={16} className="text-aurora-red mr-2 flex-shrink-0" />
                          <span className="text-sm">{selectedPhoto.exif.exposure}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-auto pt-4 text-sm text-gray-400">
                  Photo {photos.findIndex(p => p.id === selectedPhoto.id) + 1} of {photos.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
