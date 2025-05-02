
import { supabase } from "@/integrations/supabase/client";
import { Photo, PhotoDbRecord } from "./photoTypes";
import { getPublicUrl } from "./photoStorageService";

// Convert database photo record to frontend Photo object
export const mapDbRecordToPhoto = (record: PhotoDbRecord): Photo => {
  return {
    id: record.id,
    src: record.cloudinary_url || getPublicUrl(record.storage_id),
    title: record.title || '',
    description: record.description || '',
    award: record.award,
    aspectRatio: record.aspect_ratio,
    exif: record.exif as any,
    beforeAfter: record.before_after as any,
    storageId: record.storage_id,
    fileName: record.file_name,
    cloudinaryId: record.cloudinary_id,
    cloudinaryUrl: record.cloudinary_url
  };
};

// Save photo metadata to Supabase
export const savePhotoMetadata = async (photo: Partial<Photo>) => {
  try {
    const { aspectRatio, fileName, ...rest } = photo;
    
    const { data, error } = await supabase
      .from('photo_metadata')
      .insert({
        title: rest.title || '',
        description: rest.description || '',
        aspect_ratio: aspectRatio || '1/1',
        award: rest.award,
        exif: rest.exif,
        before_after: rest.beforeAfter,
        storage_id: rest.storageId || '',
        file_name: fileName || '',
        cloudinary_id: rest.cloudinaryId,
        cloudinary_url: rest.cloudinaryUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return mapDbRecordToPhoto(data as PhotoDbRecord);
  } catch (error) {
    console.error('Error saving photo metadata:', error);
    throw error;
  }
};

// Fetch photo metadata from Supabase
export const fetchPhotoMetadata = async (): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from('photo_metadata')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data as PhotoDbRecord[]).map(mapDbRecordToPhoto);
  } catch (error) {
    console.error('Error fetching photo metadata:', error);
    return [];
  }
};

// Update photo metadata
export const updatePhotoMetadata = async (photo: Partial<Photo> & { id: string }) => {
  try {
    const { id, aspectRatio, cloudinaryId, cloudinaryUrl, ...rest } = photo;
    
    const { data, error } = await supabase
      .from('photo_metadata')
      .update({
        title: rest.title,
        description: rest.description,
        aspect_ratio: aspectRatio,
        award: rest.award,
        exif: rest.exif,
        before_after: rest.beforeAfter,
        cloudinary_id: cloudinaryId,
        cloudinary_url: cloudinaryUrl
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return mapDbRecordToPhoto(data as PhotoDbRecord);
  } catch (error) {
    console.error('Error updating photo metadata:', error);
    throw error;
  }
};
