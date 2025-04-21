
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

export interface ExifData {
  camera?: string;
  date?: string;
  location?: string;
  exposure?: string;
  aperture?: string;
  iso?: string;
  focalLength?: string;
  make?: string;
  model?: string;
  [key: string]: string | undefined; // Add index signature to make compatible with Json type
}

export interface BeforeAfterData {
  before: string;
  after: string;
  [key: string]: string; // Add index signature to make compatible with Json type
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
  url?: string;          // Adding url property
  path?: string;         // Adding path property
  created_at?: string;   // Adding created_at property
  metadata?: ExifData;   // Adding metadata property for backward compatibility
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
        exif: photo.exif as unknown as Json,
        before_after: photo.beforeAfter as unknown as Json
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
      url: getPublicUrl(item.storage_id), // Add url property
      path: item.storage_id, // Add path property
      title: item.title || 'Untitled',
      description: item.description || '',
      award: item.award || undefined,
      aspectRatio: item.aspect_ratio || 'auto',
      exif: item.exif as unknown as ExifData,
      metadata: item.exif as unknown as ExifData, // Add metadata property
      beforeAfter: item.before_after as unknown as BeforeAfterData,
      storageId: item.storage_id,
      fileName: item.file_name,
      created_at: item.created_at
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
