
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface ExifData {
  camera?: string;
  date?: string;
  location?: string;
  exposure?: string;
}

export interface BeforeAfterData {
  before: string;
  after: string;
}

export interface Photo {
  id: string;
  src: string;
  title: string;
  description: string;
  award?: string;
  aspectRatio: string;
  exif?: ExifData;
  beforeAfter?: BeforeAfterData;
  storageId?: string;
  fileName?: string;
}

// Upload photo to Supabase storage
export const uploadPhoto = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(error.message);
    }

    return data.path;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload photo');
    return null;
  }
};

// Save photo metadata to database
export const savePhotoMetadata = async (photo: Omit<Photo, 'id'>): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('photo_metadata')
      .insert({
        storage_id: photo.storageId,
        file_name: photo.fileName,
        title: photo.title,
        description: photo.description,
        award: photo.award,
        aspect_ratio: photo.aspectRatio,
        exif: photo.exif,
        before_after: photo.beforeAfter
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
      src: getPublicUrl(item.storage_id),
      title: item.title || 'Untitled',
      description: item.description || '',
      award: item.award,
      aspectRatio: item.aspect_ratio || 'auto',
      exif: item.exif,
      beforeAfter: item.before_after,
      storageId: item.storage_id,
      fileName: item.file_name
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
        exif: updates.exif,
        before_after: updates.beforeAfter
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

// Delete photo and its metadata
export const deletePhoto = async (id: string, storageId: string): Promise<boolean> => {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove([storageId]);

    if (storageError) {
      throw new Error(storageError.message);
    }

    // Delete metadata
    const { error: dbError } = await supabase
      .from('photo_metadata')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw new Error(dbError.message);
    }

    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    toast.error('Failed to delete photo');
    return false;
  }
};

// Get public URL for a storage item
export const getPublicUrl = (path: string): string => {
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
};

// Calculate aspect ratio based on image dimensions
export const calculateAspectRatio = (width: number, height: number): string => {
  const ratio = width / height;
  if (ratio > 1.4) return "16/9";
  if (ratio < 0.8) return "3/4";
  return "1/1";
};
