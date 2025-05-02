
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

export interface ExifData {
  camera?: string;
  date?: string;
  location?: string;
  exposure?: string;
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
  cloudinaryId?: string;
  cloudinaryUrl?: string;
}

// Upload photo to Cloudinary via the Supabase Edge Function
export const uploadPhoto = async (file: File): Promise<{ storageId: string | null, cloudinaryUrl: string | null, cloudinaryId: string | null }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch("/api/upload-to-cloudinary", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload photo");
    }
    
    const cloudinaryData = await response.json();
    
    // Return the Cloudinary data
    return {
      storageId: null, // We're not using Supabase storage anymore
      cloudinaryUrl: cloudinaryData.secure_url,
      cloudinaryId: cloudinaryData.public_id
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload photo');
    return {
      storageId: null,
      cloudinaryUrl: null,
      cloudinaryId: null
    };
  }
};

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
      exif: item.exif as unknown as ExifData,
      beforeAfter: item.before_after as unknown as BeforeAfterData,
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

// Delete photo and its metadata
export const deletePhoto = async (id: string, cloudinaryId?: string, storageId?: string): Promise<boolean> => {
  try {
    // If we have a Cloudinary ID, delete from Cloudinary via edge function
    if (cloudinaryId) {
      const response = await fetch("/api/delete-from-cloudinary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: cloudinaryId }),
      });
      
      if (!response.ok) {
        console.error('Failed to delete from Cloudinary');
      }
    }
    
    // If we still have a storage ID (legacy), delete from storage
    if (storageId) {
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([storageId]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
      }
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

// Get public URL for a storage item (legacy support)
export const getPublicUrl = (path: string): string => {
  if (!path) return '';
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
