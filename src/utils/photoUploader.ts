
import { toast } from "sonner";
import { Photo } from "./photoTypes";

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

// Calculate aspect ratio based on image dimensions
export const calculateAspectRatio = (width: number, height: number): string => {
  const ratio = width / height;
  if (ratio > 1.4) return "16/9";
  if (ratio < 0.8) return "3/4";
  return "1/1";
};
