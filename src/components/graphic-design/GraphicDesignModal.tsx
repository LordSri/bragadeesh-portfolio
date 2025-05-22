
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Pencil, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Photo, updatePhotoMetadata } from '@/utils/photoUtils';

interface GraphicDesignModalProps {
  design: Photo | null;
  designs: Photo[];
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onDesignUpdated: () => void;
}

const GraphicDesignModal: React.FC<GraphicDesignModalProps> = ({
  design,
  designs,
  onClose,
  onNavigate,
  onDesignUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDesign, setEditedDesign] = useState<Partial<Photo>>({});
  
  if (!design) return null;

  const handleEditToggle = () => {
    if (isEditing) {
      // Exiting edit mode - reset form
      setIsEditing(false);
      setEditedDesign({});
    } else {
      // Entering edit mode - populate form with current values
      setIsEditing(true);
      setEditedDesign({
        title: design.title,
        description: design.description
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!design) return;
      
      const success = await updatePhotoMetadata(design.id, editedDesign);
      
      if (success) {
        toast.success('Design updated successfully');
        setIsEditing(false);
        onDesignUpdated();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to update design');
    }
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in overflow-auto">
      {/* Fixed background with blur effect */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md"></div>

      {/* Close button */}
      <div className="absolute top-4 right-4 z-10">
        <button onClick={onClose} className="h-10 w-10 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      </div>
      
      {/* Main content area */}
      <div className="relative min-h-screen flex flex-col md:flex-row items-start md:items-center justify-center p-4 pb-24 overflow-y-auto">
        <div className="w-full max-w-[2000px] mx-auto flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
          {/* Left side - Image */}
          <div className="flex-1 relative flex items-start md:items-center justify-center w-full">
            <div className="w-full relative">
              <img 
                src={design.src} 
                alt={design.title || 'Design'} 
                className="w-full max-w-full object-contain select-none" 
                style={{
                  maxHeight: 'calc(100vh - 8rem)',
                  touchAction: 'none',
                  WebkitTouchCallout: 'none',
                  pointerEvents: 'none'
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            
            {/* Navigation arrows */}
            <button onClick={() => onNavigate('prev')} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full glass-morphism flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronLeft size={28} />
            </button>
            <button onClick={() => onNavigate('next')} className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full glass-morphism flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronRight size={28} />
            </button>
          </div>
          
          {/* Right side - Details panel (simplified) */}
          <div className="md:w-80 lg:w-96 glass-morphism rounded-xl flex flex-col max-h-[70vh] self-center">
            <div className="flex justify-between items-start p-6 pb-4">
              <h2 className="text-2xl font-bold">{design.title || 'Untitled'}</h2>
              <div className="flex gap-2">
                {!isEditing && (
                  <button onClick={handleEditToggle} className="h-8 w-8 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-white/20 transition-colors" title="Edit">
                    <Pencil size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input 
                      value={editedDesign.title || ''} 
                      onChange={e => setEditedDesign({...editedDesign, title: e.target.value})} 
                      className="bg-black/30 border-white/20" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea 
                      value={editedDesign.description || ''} 
                      onChange={e => setEditedDesign({...editedDesign, description: e.target.value})} 
                      className="bg-black/30 border-white/20" 
                      rows={3} 
                    />
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
                </div>
              ) : (
                <>
                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-gray-300">{design.description || 'No description provided.'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-2 md:pb-4">
        <div className="mx-auto px-4 overflow-x-auto scrollbar-hide" style={{ maxWidth: '100%' }}>
          <div className="flex space-x-2 py-2">
            {designs.map((item) => (
              <img
                key={`thumbnail-${item.id}`}
                src={item.src}
                alt={item.title || 'Design'}
                onClick={() => onNavigate(item.id > design.id ? 'next' : 'prev')}
                className={`h-10 w-14 object-cover cursor-pointer rounded-sm transition-all duration-300
                  ${item.id === design.id ? "ring-2 ring-white opacity-100 scale-110" : "opacity-40 grayscale hover:opacity-70 hover:grayscale-0"}`}
                loading="lazy"
                onContextMenu={(e) => e.preventDefault()}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphicDesignModal;
