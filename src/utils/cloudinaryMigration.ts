
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Utility function to migrate photos from Supabase Storage to Cloudinary
 * This function should be called from a component or admin page
 */
export const migratePhotosToCloudinary = async (): Promise<void> => {
  try {
    // 1. Get all photos that don't have Cloudinary URLs yet
    const { data: photos, error } = await supabase
      .from('photo_metadata')
      .select('*')
      .is('cloudinary_url', null)
      .not('storage_id', 'is', null);
    
    if (error) {
      throw error;
    }
    
    if (!photos || photos.length === 0) {
      toast.info('No photos to migrate!');
      return;
    }
    
    toast.info(`Starting migration of ${photos.length} photos...`);
    let successCount = 0;
    let failCount = 0;
    
    // 2. Process each photo
    for (const photo of photos) {
      try {
        // 3. Download the photo from Supabase Storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('photos')
          .download(photo.storage_id);
          
        if (downloadError || !fileData) {
          throw downloadError || new Error('Failed to download file');
        }
        
        // 4. Create a File object from the blob
        const file = new File([fileData], photo.file_name, {
          type: fileData.type,
        });
        
        // 5. Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload-to-cloudinary', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${await response.text()}`);
        }
        
        const cloudinaryData = await response.json();
        
        // 6. Update the photo metadata with Cloudinary info
        const { error: updateError } = await supabase
          .from('photo_metadata')
          .update({
            cloudinary_id: cloudinaryData.public_id,
            cloudinary_url: cloudinaryData.secure_url,
          })
          .eq('id', photo.id);
          
        if (updateError) {
          throw updateError;
        }
        
        successCount++;
        toast.success(`Migrated: ${photo.file_name}`);
      } catch (err) {
        console.error(`Failed to migrate ${photo.file_name}:`, err);
        failCount++;
      }
    }
    
    toast.success(`Migration completed! Successfully migrated ${successCount} photos. Failed: ${failCount}`);
  } catch (error) {
    console.error('Migration error:', error);
    toast.error('Failed to migrate photos');
  }
};
