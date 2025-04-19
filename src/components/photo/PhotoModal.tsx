import React, { useState } from 'react';
import { Photo, ExifData, updatePhotoMetadata, deletePhoto } from '@/utils/photoUtils';
import { ChevronRight, ChevronLeft, X, Calendar, Clock, MapPin, Camera, Pencil, Save, Trash2, Download, Award } from 'lucide-react';
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
  showDetails?: boolean;
  hideDownload?: boolean;
}
const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  photos,
  onClose,
  onNavigate,
  onPhotoUpdated,
  showDetails = true,
  hideDownload = false
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
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = photo.src;
    a.download = photo.fileName || `${photo.title}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Photo download started');
  };
  return <div className="fixed inset-0 z-50 animate-fade-in overflow-auto">
      {/* Fixed background with blur effect */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md"></div>

      {/* Close button */}
      <div className="absolute top-4 right-4 z-10">
        <button onClick={onClose} className="h-10 w-10 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-white/10 transition-colors" aria-label="Close">
          <X size={20} />
        </button>
      </div>
      
      {/* Main content area with improved vertical alignment */}
      <div className="relative h-full min-h-screen flex items-center justify-center p-4 pb-24 bg-black/90\n">
        <div className="w-full max-w-[2000px] mx-auto flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          {/* Left side - Image with proper vertical centering */}
          <div className="flex-1 relative flex items-center justify-center w-full">
            {photo.beforeAfter ? <div className="relative w-full h-full">
                {/* Before/After slider implementation */}
                <div className="absolute inset-0 overflow-hidden">
                  <img src={photo.beforeAfter.before} alt="Before" className="w-full h-full object-contain" />
                </div>
                <div className="absolute inset-0 overflow-hidden" style={{
              clipPath: `inset(0 0 0 ${beforeAfterSlider}%)`
            }}>
                  <img src={photo.beforeAfter.after} alt="After" className="w-full h-full object-contain" />
                </div>
                <div className="absolute inset-0 flex items-center">
                  <div className="relative w-full" style={{
                touchAction: 'none'
              }}>
                    <input type="range" min="0" max="100" value={beforeAfterSlider} onChange={e => setBeforeAfterSlider(parseInt(e.target.value))} className="w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500" />
                    <div className="absolute top-1/2 w-0.5 h-full bg-white pointer-events-none transform -translate-y-1/2" style={{
                  left: `${beforeAfterSlider}%`
                }} />
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-black/50 p-2 px-3 rounded-full text-xs font-medium">
                  Before / After
                </div>
              </div> : <img src={photo.src} alt={photo.title} className="max-w-full max-h-[70vh] object-contain" />}
            
            {/* Navigation arrows with improved positioning */}
            <button onClick={() => onNavigate('prev')} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full glass-morphism flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Previous photo">
              <ChevronLeft size={28} />
            </button>
            <button onClick={() => onNavigate('next')} className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full glass-morphism flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Next photo">
              <ChevronRight size={28} />
            </button>
          </div>
          
          {/* Right side - Details panel with improved spacing */}
          {showDetails && <div className="md:w-80 lg:w-96 glass-morphism rounded-xl flex flex-col max-h-[70vh] self-center">
              <div className="flex justify-between items-start p-6 pb-4">
                <h2 className="text-2xl font-bold">{photo.title}</h2>
                <div className="flex gap-2">
                  {!isEditing && <>
                      <button onClick={handleEditToggle} className="h-8 w-8 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-white/20 transition-colors" title="Edit">
                        <Pencil size={16} />
                      </button>
                      
                      {!hideDownload && <button onClick={handleDownload} className="h-8 w-8 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-white/20 transition-colors" title="Download">
                          <Download size={16} />
                        </button>}
                      
                      <button onClick={() => setIsDeleting(true)} className="h-8 w-8 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-red-500/30 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </>}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2">
                {isEditing ? <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input value={editedPhoto.title || ''} onChange={e => setEditedPhoto({
                  ...editedPhoto,
                  title: e.target.value
                })} className="bg-black/30 border-white/20" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea value={editedPhoto.description || ''} onChange={e => setEditedPhoto({
                  ...editedPhoto,
                  description: e.target.value
                })} className="bg-black/30 border-white/20" rows={3} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Award (optional)</label>
                      <Input value={editedPhoto.award || ''} onChange={e => setEditedPhoto({
                  ...editedPhoto,
                  award: e.target.value
                })} className="bg-black/30 border-white/20" placeholder="e.g. Nature Photography Award 2023" />
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <h3 className="text-lg font-medium">Photo Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Camera</label>
                        <Input value={editedExif.camera || ''} onChange={e => setEditedExif({
                    ...editedExif,
                    camera: e.target.value
                  })} className="bg-black/30 border-white/20" placeholder="e.g. Canon EOS 5D Mark IV" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <Input value={editedExif.date || ''} onChange={e => setEditedExif({
                    ...editedExif,
                    date: e.target.value
                  })} className="bg-black/30 border-white/20" placeholder="e.g. January 15, 2023" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input value={editedExif.location || ''} onChange={e => setEditedExif({
                    ...editedExif,
                    location: e.target.value
                  })} className="bg-black/30 border-white/20" placeholder="e.g. Tromsø, Norway" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Exposure</label>
                        <Input value={editedExif.exposure || ''} onChange={e => setEditedExif({
                    ...editedExif,
                    exposure: e.target.value
                  })} className="bg-black/30 border-white/20" placeholder="e.g. 30s, f/2.8, ISO 1600" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={handleEditToggle} className="border-white/20">
                        Cancel
                      </Button>
                      <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700">
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div> : <>
                    {/* Description */}
                    <div className="mb-6">
                      <p className="text-gray-300">{photo.description}</p>
                    </div>
                    
                    {/* Award badge if present */}
                    {photo.award && <div className="flex items-center p-3 glass-morphism rounded-lg bg-blue-900/30 mb-6">
                        <Award size={18} className="text-blue-400 mr-2 flex-shrink-0" />
                        <span>{photo.award}</span>
                      </div>}
                    
                    {/* EXIF data with improved styling */}
                    {photo.exif && Object.values(photo.exif).some(val => val) && <div className="space-y-4">
                        <h3 className="text-lg font-medium">Photo Details</h3>
                        
                        <div className="space-y-3">
                          {photo.exif.camera && <div className="flex items-center glass-morphism p-2 px-4 rounded-lg">
                              <Camera size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                              <span>{photo.exif.camera}</span>
                            </div>}
                          
                          {photo.exif.date && <div className="flex items-center glass-morphism p-2 px-4 rounded-lg">
                              <Calendar size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                              <span>{photo.exif.date}</span>
                            </div>}
                          
                          {photo.exif.location && <div className="flex items-center glass-morphism p-2 px-4 rounded-lg">
                              <MapPin size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                              <span>{photo.exif.location}</span>
                            </div>}
                          
                          {photo.exif.exposure && <div className="flex items-center glass-morphism p-2 px-4 rounded-lg">
                              <Clock size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                              <span>{photo.exif.exposure}</span>
                            </div>}
                        </div>
                      </div>}
                  </>}
              </div>
            </div>}
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
    </div>;
};
export default PhotoModal;