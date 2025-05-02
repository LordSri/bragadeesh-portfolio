import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Download, Edit, Trash2, Award } from 'lucide-react';
import { Photo } from '@/utils/photoTypes';
import { deletePhoto } from '@/utils/photoDeleteService';
import { toast } from 'sonner';
import PhotoEditForm from './PhotoEditForm';
import PhotoRating from './PhotoRating';

interface PhotoModalProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onPhotoUpdated: () => void;
  showDetails?: boolean;
  hideDownload?: boolean;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  photos,
  onClose,
  onNavigate,
  onPhotoUpdated,
  showDetails = false,
  hideDownload = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.src;
    link.download = photo.fileName || 'photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    if (!window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const success = await deletePhoto(photo.id, photo.cloudinaryId, photo.storageId);
      if (success) {
        toast.success('Photo deleted successfully');
        onClose();
        onPhotoUpdated();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-7xl w-full p-0 bg-black/90 border-gray-800">
        <div className="relative flex flex-col md:flex-row h-[90vh]">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 z-50 p-1 rounded-full bg-black/50 hover:bg-black/80 text-white"
          >
            <X size={24} />
          </button>
          
          {/* Navigation buttons */}
          <button 
            onClick={() => onNavigate('prev')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => onNavigate('next')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Photo */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <img 
              src={photo.src} 
              alt={photo.title || 'Photo'} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          {/* Details panel */}
          {showDetails && (
            <div className="w-full md:w-80 bg-gray-900 p-6 overflow-y-auto">
              {isEditing ? (
                <PhotoEditForm 
                  photo={photo} 
                  onCancel={() => setIsEditing(false)} 
                  onSave={() => {
                    setIsEditing(false);
                    onPhotoUpdated();
                  }} 
                />
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">{photo.title || 'Untitled'}</h2>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsEditing(true)}
                        title="Edit photo"
                      >
                        <Edit size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-red-500 hover:text-red-400"
                        title="Delete photo"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                  
                  {photo.award && (
                    <div className="mb-4 flex items-center text-yellow-500">
                      <Award size={18} className="mr-2" />
                      <span>{photo.award}</span>
                    </div>
                  )}
                  
                  {photo.description && (
                    <p className="text-gray-300 mb-6">{photo.description}</p>
                  )}
                  
                  {/* Photo rating component */}
                  <PhotoRating photoId={photo.id} />
                  
                  {/* EXIF data */}
                  {photo.exif && Object.keys(photo.exif).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Photo Details</h3>
                      <div className="space-y-1 text-sm">
                        {Object.entries(photo.exif).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">{key}</span>
                            <span className="text-gray-300">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Download button */}
                  {!hideDownload && (
                    <Button 
                      onClick={handleDownload} 
                      className="w-full mt-4"
                      variant="outline"
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;
