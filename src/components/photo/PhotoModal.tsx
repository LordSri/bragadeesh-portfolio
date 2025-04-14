
import React, { useState } from 'react';
import { Photo, ExifData, updatePhotoMetadata, deletePhoto } from '@/utils/photoUtils';
import { ChevronRight, ChevronLeft, X, Calendar, Clock, MapPin, Camera, Pencil, Save, Trash2, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface PhotoModalProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onPhotoUpdated: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ 
  photo, 
  photos, 
  onClose, 
  onNavigate,
  onPhotoUpdated
}) => {
  const [beforeAfterSlider, setBeforeAfterSlider] = useState(50);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState<Partial<Photo>>({});
  const [editedExif, setEditedExif] = useState<ExifData>({});
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!photo) return null;

  const handleEditToggle = () => {
    if (isEditing) {
      // Exiting edit mode - reset form
      setIsEditing(false);
      setEditedPhoto({});
      setEditedExif({});
    } else {
      // Entering edit mode - populate form with current values
      setIsEditing(true);
      setEditedPhoto({
        title: photo.title,
        description: photo.description,
        award: photo.award
      });
      setEditedExif(photo.exif || {});
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!photo) return;
      
      const updates = {
        ...editedPhoto,
        exif: editedExif
      };
      
      const success = await updatePhotoMetadata(photo.id, updates);
      
      if (success) {
        toast.success('Photo updated successfully');
        setIsEditing(false);
        onPhotoUpdated();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to update photo');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!photo || !photo.storageId) return;
      
      const success = await deletePhoto(photo.id, photo.storageId);
      
      if (success) {
        toast.success('Photo deleted successfully');
        onClose();
        onPhotoUpdated();
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-lg animate-fade-in">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {!isEditing && (
          <>
            <button 
              onClick={handleEditToggle} 
              className="h-10 w-10 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-blue-500/40 transition-colors"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={() => setIsDeleting(true)}
              className="h-10 w-10 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500/40 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
        <button 
          onClick={isEditing ? handleEditToggle : onClose} 
          className="h-10 w-10 rounded-full bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-700/50 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="relative flex-1 w-full flex items-center justify-center p-4 overflow-hidden">
        {/* Main Image */}
        <div className="max-h-[70vh] max-w-full overflow-hidden flex items-center justify-center">
          {photo.beforeAfter ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={photo.beforeAfter.before} 
                  alt="Before" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div 
                className="absolute inset-0 overflow-hidden" 
                style={{ clipPath: `inset(0 0 0 ${beforeAfterSlider}%)` }}
              >
                <img 
                  src={photo.beforeAfter.after} 
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
                    className="w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                  <div 
                    className="absolute top-1/2 w-0.5 h-full bg-white pointer-events-none transform -translate-y-1/2" 
                    style={{ left: `${beforeAfterSlider}%` }}
                  />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-black/50 p-2 px-3 rounded-full text-xs font-medium">
                Before / After
              </div>
            </div>
          ) : (
            <img 
              src={photo.src} 
              alt={photo.title} 
              className="max-w-full max-h-[70vh] object-contain transition-transform duration-300 ease-out"
            />
          )}
        </div>
        
        {/* Navigation arrows - improved with better styling and hover effects */}
        <button 
          onClick={() => onNavigate('prev')} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all duration-300 hover:scale-110"
          aria-label="Previous photo"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          onClick={() => onNavigate('next')} 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all duration-300 hover:scale-110"
          aria-label="Next photo"
        >
          <ChevronRight size={28} />
        </button>
      </div>
      
      {/* Photo Info - moved above thumbnail navigation */}
      <div className="w-full bg-black/60 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-3xl w-full mx-auto px-4 py-3">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    value={editedPhoto.title || ''}
                    onChange={(e) => setEditedPhoto({...editedPhoto, title: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Award (optional)</label>
                  <Input 
                    value={editedPhoto.award || ''}
                    onChange={(e) => setEditedPhoto({...editedPhoto, award: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                    placeholder="e.g. Nature Photography Award 2023"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  value={editedPhoto.description || ''}
                  onChange={(e) => setEditedPhoto({...editedPhoto, description: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Camera</label>
                  <Input 
                    value={editedExif.camera || ''}
                    onChange={(e) => setEditedExif({...editedExif, camera: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                    placeholder="e.g. Canon EOS 5D Mark IV"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input 
                    value={editedExif.date || ''}
                    onChange={(e) => setEditedExif({...editedExif, date: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                    placeholder="e.g. January 15, 2023"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input 
                    value={editedExif.location || ''}
                    onChange={(e) => setEditedExif({...editedExif, location: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                    placeholder="e.g. Tromsø, Norway"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Exposure</label>
                  <Input 
                    value={editedExif.exposure || ''}
                    onChange={(e) => setEditedExif({...editedExif, exposure: e.target.value})}
                    className="bg-gray-800 border-gray-700" 
                    placeholder="e.g. 30s, f/2.8, ISO 1600"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={handleEditToggle}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700">
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-1">{photo.title}</h2>
                <p className="text-gray-300 text-sm">{photo.description}</p>
              </div>
              
              {photo.award && (
                <div className="flex items-center p-2 glass-panel rounded-lg bg-blue-950/30">
                  <Award size={16} className="text-blue-400 mr-2 flex-shrink-0" />
                  <span className="text-xs">{photo.award}</span>
                </div>
              )}
            </div>
          )}
          
          {!isEditing && photo.exif && (
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
              {photo.exif.camera && (
                <div className="flex items-center">
                  <Camera size={14} className="text-blue-400 mr-1 flex-shrink-0" />
                  <span>{photo.exif.camera}</span>
                </div>
              )}
              {photo.exif.date && (
                <div className="flex items-center">
                  <Calendar size={14} className="text-blue-400 mr-1 flex-shrink-0" />
                  <span>{photo.exif.date}</span>
                </div>
              )}
              {photo.exif.location && (
                <div className="flex items-center">
                  <MapPin size={14} className="text-blue-400 mr-1 flex-shrink-0" />
                  <span>{photo.exif.location}</span>
                </div>
              )}
              {photo.exif.exposure && (
                <div className="flex items-center">
                  <Clock size={14} className="text-blue-400 mr-1 flex-shrink-0" />
                  <span>{photo.exif.exposure}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogTitle>Delete Photo</DialogTitle>
          <p className="py-4">Are you sure you want to delete this photo? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoModal;
