import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Trash2, Edit, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Photo } from '@/utils/photoUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import PhotoRating from './PhotoRating';

interface PhotoModalProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onPhotoUpdated?: () => Promise<void>;
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
  hideDownload = false
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInfo, setShowInfo] = useState(showDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(photo.title || '');
  const [description, setDescription] = useState(photo.description || '');
  const { toast } = useToast();
  
  const handleDownload = async () => {
    try {
      const { data } = await supabase.storage
        .from('photos')
        .download(photo.path);
      
      if (!data) {
        throw new Error('Could not download the image');
      }
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = photo.title || 'photo';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your photo is being downloaded",
      });
    } catch (error) {
      console.error('Error downloading photo:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the photo",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async () => {
    if (!onPhotoUpdated) return;
    
    setIsDeleting(true);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.path]);
      
      if (storageError) throw storageError;
      
      // Delete metadata
      const { error: dbError } = await supabase
        .from('photo_metadata')
        .delete()
        .eq('id', photo.id);
      
      if (dbError) throw dbError;
      
      toast({
        title: "Photo deleted",
        description: "The photo has been successfully deleted",
      });
      
      onClose();
      await onPhotoUpdated();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the photo",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleSaveEdit = async () => {
    if (!onPhotoUpdated) return;
    
    try {
      const { error } = await supabase
        .from('photo_metadata')
        .update({
          title,
          description,
          updated_at: new Date().toISOString()
        })
        .eq('id', photo.id);
      
      if (error) throw error;
      
      toast({
        title: "Photo updated",
        description: "The photo details have been updated",
      });
      
      setIsEditing(false);
      await onPhotoUpdated();
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating the photo details",
        variant: "destructive",
      });
    }
  };
  
  // Determine if we should use Dialog (desktop) or Drawer (mobile)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const modalContent = (
    <>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="Close"
      >
        <X size={20} />
      </button>
      
      {/* Navigation buttons */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40">
        <button
          onClick={() => onNavigate('prev')}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-40">
        <button
          onClick={() => onNavigate('next')}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Image */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={photo.url}
          alt={photo.title || 'Photo'}
          className="max-h-full max-w-full object-contain select-none"
          style={{ userSelect: 'none' }}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      
      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
                  placeholder="Title"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
                  placeholder="Description"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-white">{photo.title || 'Untitled'}</h3>
                {photo.description && (
                  <p className="text-sm text-gray-300">{photo.description}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Rating component */}
            <PhotoRating photoId={photo.id} size="md" />
            
            {/* Info button */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={cn(
                "p-2 rounded-full transition-colors",
                showInfo ? "bg-red-500/70 text-white" : "bg-black/50 text-white hover:bg-black/70"
              )}
              aria-label="Show info"
            >
              <Info size={18} />
            </button>
            
            {/* Download button */}
            {!hideDownload && (
              <button
                onClick={handleDownload}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Download photo"
              >
                <Download size={18} />
              </button>
            )}
            
            {/* Edit button */}
            {onPhotoUpdated && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isEditing ? "bg-red-500/70 text-white" : "bg-black/50 text-white hover:bg-black/70"
                )}
                aria-label="Edit photo"
              >
                <Edit size={18} />
              </button>
            )}
            
            {/* Delete button */}
            {onPhotoUpdated && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-red-500/70 transition-colors"
                aria-label="Delete photo"
                disabled={isDeleting}
              >
                <Trash2 size={18} className={isDeleting ? "animate-spin" : ""} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Photo details */}
      {showInfo && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="text-sm text-gray-300 space-y-1">
            <p>Uploaded: {new Date(photo.created_at).toLocaleDateString()}</p>
            {photo.metadata && (
              <>
                {photo.metadata.make && photo.metadata.model && (
                  <p>Camera: {photo.metadata.make} {photo.metadata.model}</p>
                )}
                {photo.metadata.exposure && (
                  <p>Exposure: {photo.metadata.exposure}</p>
                )}
                {photo.metadata.aperture && (
                  <p>Aperture: {photo.metadata.aperture}</p>
                )}
                {photo.metadata.iso && (
                  <p>ISO: {photo.metadata.iso}</p>
                )}
                {photo.metadata.focalLength && (
                  <p>Focal Length: {photo.metadata.focalLength}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
  
  return isMobile ? (
    <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[95vh] bg-black">
        <div className="relative h-full w-full">
          {modalContent}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 bg-black border-gray-800">
        <div className="relative h-full w-full">
          {modalContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;
