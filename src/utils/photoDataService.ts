
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Photo } from "./photoTypes";
import { Json } from "@/integrations/supabase/types";
import { getPublicUrl } from "./photoStorageService";

// Save photo metadata to database
export const savePhotoMetadata = async (photo: Omit<Photo, 'id'>): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('photo_metadata')
      .insert({
        storage_id: photo.storageId || null,
        file_name: photo.fileName,
        title: photo.title,
        description: photo.description,
        award: photo.award,
        aspect_ratio: photo.aspectRatio,
        exif: photo.exif as unknown as Json,
        before_after: photo.beforeAfter as unknown as Json,
        cloudinary_id: photo.cloudinaryId,
        cloudinary_url: photo.cloudinaryUrl
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data.id;
  } catch (error) {
    console.error('Error saving photo metadata:', error);
    toast.error('Failed to save photo information');
    return null;
  }
};

// Fetch photo metadata from database
export const fetchPhotoMetadata = async (): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from('photo_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(item => ({
      id: item.id,
      src: item.cloudinary_url || getPublicUrl(item.storage_id), // Prefer Cloudinary URL if available
      title: item.title || 'Untitled',
      description: item.description || '',
      award: item.award || undefined,
      aspectRatio: item.aspect_ratio || 'auto',
      exif: item.exif as unknown as Photo['exif'],
      beforeAfter: item.before_after as unknown as Photo['beforeAfter'],
      storageId: item.storage_id,
      fileName: item.file_name,
      cloudinaryId: item.cloudinary_id || undefined,
      cloudinaryUrl: item.cloudinary_url || undefined
    }));
  } catch (error) {
    console.error('Error fetching photo metadata:', error);
    toast.error('Failed to load photos');
    return [];
  }
};

// Update photo metadata
export const updatePhotoMetadata = async (id: string, updates: Partial<Photo>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('photo_metadata')
      .update({
        title: updates.title,
        description: updates.description,
        award: updates.award,
        aspect_ratio: updates.aspectRatio,
        exif: updates.exif as unknown as Json,
        before_after: updates.beforeAfter as unknown as Json
      })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Error updating photo metadata:', error);
    toast.error('Failed to update photo');
    return false;
  }
};
