
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
