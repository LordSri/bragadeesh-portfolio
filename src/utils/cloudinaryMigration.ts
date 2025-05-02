
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Photo, PhotoDbRecord } from "./photoTypes";
import { getPublicUrl } from "./photoStorageService";
import { updatePhotoMetadata } from "./photoDataService";

// Migrate photos from Supabase storage to Cloudinary
export const migratePhotosToCloudinary = async () => {
  try {
    // Get photos that don't have cloudinary_url yet
    const { data, error } = await supabase
      .from('photo_metadata')
      .select('*')
      .is('cloudinary_url', null);

    if (error) {
      toast.error('Failed to fetch photos for migration');
      throw error;
    }

    if (!data || data.length === 0) {
      toast.info('No photos to migrate');
      return;
    }

    toast.info(`Starting migration for ${data.length} photos`);

    // Process each photo
    for (const photo of data as PhotoDbRecord[]) {
      try {
        // Get photo from Supabase storage
        const publicUrl = getPublicUrl(photo.storage_id);
        if (!publicUrl) {
          console.error(`No public URL for photo ${photo.id}`);
          continue;
        }

        // Upload to Cloudinary via Edge Function
        const response = await fetch('/api/upload-to-cloudinary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: publicUrl,
            fileName: photo.file_name,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to upload to Cloudinary: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.secure_url || !result.public_id) {
          throw new Error('Invalid response from Cloudinary');
        }

        // Update photo metadata
        await supabase
          .from('photo_metadata')
          .update({
            cloudinary_id: result.public_id,
            cloudinary_url: result.secure_url
          })
          .eq('id', photo.id);

        toast.success(`Migrated: ${photo.title || photo.file_name}`);
      } catch (err) {
        console.error(`Error migrating photo ${photo.id}:`, err);
        toast.error(`Failed to migrate: ${photo.title || photo.file_name}`);
      }
    }

    toast.success('Migration completed!');
  } catch (err) {
    console.error('Migration error:', err);
    toast.error('Photo migration failed');
  }
};
