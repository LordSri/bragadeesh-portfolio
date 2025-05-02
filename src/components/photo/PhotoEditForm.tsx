
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Photo } from '@/utils/photoTypes';
import { updatePhotoMetadata } from '@/utils/photoDataService';
import { toast } from 'sonner';

interface PhotoEditFormProps {
  photo: Photo;
  onCancel: () => void;
  onSave: () => void;
}

const PhotoEditForm: React.FC<PhotoEditFormProps> = ({ photo, onCancel, onSave }) => {
  const [title, setTitle] = useState(photo.title || '');
  const [description, setDescription] = useState(photo.description || '');
  const [award, setAward] = useState(photo.award || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      const success = await updatePhotoMetadata(photo.id, {
        title,
        description,
        award: award || null,
      });
      
      if (success) {
        toast.success('Photo updated successfully');
        onSave();
      } else {
        toast.error('Failed to update photo');
      }
    } catch (error) {
      console.error('Error updating photo:', error);
      toast.error('Failed to update photo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Photo title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Photo description"
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="award">Award/Recognition (optional)</Label>
        <Input
          id="award"
          value={award}
          onChange={(e) => setAward(e.target.value)}
          placeholder="e.g. First Place, Editor's Choice"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default PhotoEditForm;
